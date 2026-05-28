import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { sendOrderNotification } from './email.service';
import {
  ALLOWED_TRANSITIONS,
  type OrderStatus,
} from '@/lib/orderStatus';

// --- ОШИБКИ ---

export class ProductNotFoundOrInactiveError extends Error {
  constructor(public productId: number, message: string) {
    super(message);
    this.name = 'ProductNotFoundOrInactiveError';
  }
}

export class InsufficientStockError extends Error {
  constructor(
    public productId: number,
    public productName: string,
    public requested: number,
    public available: number
  ) {
    super(`Недостаточно товара "${productName}" на складе: запрошено ${requested}, доступно ${available}`);
    this.name = 'InsufficientStockError';
  }
}

export class OrderNotFoundError extends Error {
  constructor(public orderId: number) {
    super(`Заказ #${orderId} не найден`);
    this.name = 'OrderNotFoundError';
  }
}

export class OrderCannotBeCancelledError extends Error {
  constructor(public orderId: number, public status: string) {
    super(`Заказ #${orderId} нельзя отменить: текущий статус ${status}`);
    this.name = 'OrderCannotBeCancelledError';
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(public orderId: number, public from: string, public to: string) {
    super(`Недопустимый переход статуса заказа #${orderId}: ${from} → ${to}`);
    this.name = 'InvalidStatusTransitionError';
  }
}

export class PersonalizationRequiredError extends Error {
  constructor(public productId: number, public productName: string) {
    super(`Для товара "${productName}" необходимо заполнить опросник памятника`);
    this.name = 'PersonalizationRequiredError';
  }
}

export class ServiceNotFoundError extends Error {
  constructor(public serviceId: number) {
    super(`Дополнительная услуга #${serviceId} не найдена или недоступна`);
    this.name = 'ServiceNotFoundError';
  }
}

export class ContactInfoRequiredError extends Error {
  constructor(message = 'Для гостевого заказа необходимо указать контактные данные') {
    super(message);
    this.name = 'ContactInfoRequiredError';
  }
}

// --- ИНТЕРФЕЙСЫ ---

export interface PersonalizationInput {
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  birth_date?: string | null;
  death_date?: string | null;
  portrait_photo?: string | null;
  epitaph?: string | null;
  symbol?: 'NONE' | 'ORTHODOX_CROSS' | 'CATHOLIC_CROSS' | 'CRESCENT' | 'STAR_OF_DAVID' | 'OTHER';
  notes?: string | null;
}

export interface OrderItemInput {
  product_id: number;
  quantity: number;
  personalization?: PersonalizationInput | null;
}

export interface OrderServiceInput {
  service_id: number;
  quantity: number;
}

export interface OrderDeliveryInput {
  cemetery_name?: string | null;
  cemetery_address: string;
  city?: string | null;
  region?: string | null;
  contact_phone: string;
  preferred_date?: string | null;
  comment?: string | null;
}

export interface OrderContactInput {
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  phone: string;
  email?: string | null;
  preferred_contact?: 'PHONE' | 'EMAIL' | 'WHATSAPP' | 'TELEGRAM' | 'VIBER' | null;
  comment?: string | null;
}

export interface CreateOrderInput {
  userId?: number | null;
  orderItems: OrderItemInput[];
  services?: OrderServiceInput[];
  delivery?: OrderDeliveryInput | null;
  contact?: OrderContactInput | null;
  paymentMethod?: 'ONLINE' | 'OFFLINE';
}

// --- ВСПОМОГАТЕЛЬНЫЕ ---

function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  return `GRA-${yy}${mm}${dd}-${random}`;
}

function toDateOrNull(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// --- ОСНОВНАЯ ЛОГИКА ---

export async function createOrderWithInventory(input: CreateOrderInput) {
  const {
    userId,
    orderItems,
    services = [],
    delivery = null,
    contact = null,
    paymentMethod = 'OFFLINE',
  } = input;

  if (!orderItems.length) {
    throw new Error('Заказ должен содержать хотя бы один товар');
  }

  if (!userId && !contact) {
    throw new ContactInfoRequiredError();
  }

  const orderResult = await prisma.$transaction(async (tx) => {
    // 1. Проверка товаров и расчёт стоимости товарной части
    const itemsWithPrice: Array<{
      product_id: number;
      quantity: number;
      price_at_purchase: Prisma.Decimal | number;
      productName: string;
      personalization: PersonalizationInput | null;
    }> = [];
    let totalAmount = 0;

    for (const item of orderItems) {
      const product = await tx.product.findUnique({
        where: { id: item.product_id },
        select: {
          id: true,
          name: true,
          price: true,
          discounted_price: true,
          is_active: true,
          stock_quantity: true,
          requires_personalization: true,
        },
      });

      if (!product) {
        throw new ProductNotFoundOrInactiveError(item.product_id, `Товар не найден`);
      }
      if (!product.is_active) {
        throw new ProductNotFoundOrInactiveError(item.product_id, `Товар "${product.name}" недоступен`);
      }

      const available = product.stock_quantity ?? 0;
      if (available < item.quantity) {
        throw new InsufficientStockError(product.id, product.name, item.quantity, available);
      }

      if (product.requires_personalization && !item.personalization) {
        throw new PersonalizationRequiredError(product.id, product.name);
      }

      const price = product.discounted_price ?? product.price;
      totalAmount += Number(price) * item.quantity;

      itemsWithPrice.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: price,
        productName: product.name,
        personalization: item.personalization ?? null,
      });
    }

    // 2. Проверка и расчёт стоимости услуг
    const servicesWithPrice: Array<{
      service_id: number;
      quantity: number;
      price_at_purchase: number;
    }> = [];

    for (const svc of services) {
      const service = await tx.additionalService.findUnique({
        where: { id: svc.service_id },
        select: { id: true, price: true, is_active: true },
      });

      if (!service || !service.is_active) {
        throw new ServiceNotFoundError(svc.service_id);
      }

      const qty = svc.quantity > 0 ? svc.quantity : 1;
      const linePrice = Number(service.price) * qty;
      totalAmount += linePrice;

      servicesWithPrice.push({
        service_id: svc.service_id,
        quantity: qty,
        price_at_purchase: Number(service.price),
      });
    }

    // 3. Атомарное списание остатков
    for (const item of itemsWithPrice) {
      const updated = await tx.product.updateMany({
        where: { id: item.product_id, stock_quantity: { gte: item.quantity } },
        data: { stock_quantity: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        throw new InsufficientStockError(item.product_id, item.productName, item.quantity, 0);
      }
    }

    // 4. Генерация уникального order_number
    let orderNumber = generateOrderNumber();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const collision = await tx.order.findUnique({
        where: { order_number: orderNumber },
        select: { id: true },
      });
      if (!collision) break;
      orderNumber = generateOrderNumber();
    }

    // 5. Создание заказа со всеми связями
    return tx.order.create({
      data: {
        user_id: userId ?? null,
        order_number: orderNumber,
        status: 'NEW',
        payment_method: paymentMethod,
        total_amount: Math.round(totalAmount * 100) / 100,
        contact_first_name: contact?.first_name ?? null,
        contact_last_name: contact?.last_name ?? null,
        contact_patronymic: contact?.patronymic ?? null,
        contact_phone: contact?.phone ?? null,
        contact_email: contact?.email ?? null,
        preferred_contact: contact?.preferred_contact ?? null,
        customer_comment: contact?.comment ?? null,
        order_items: {
          create: itemsWithPrice.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            personalization: item.personalization
              ? {
                  create: {
                    first_name: item.personalization.first_name,
                    last_name: item.personalization.last_name,
                    patronymic: item.personalization.patronymic ?? null,
                    birth_date: toDateOrNull(item.personalization.birth_date),
                    death_date: toDateOrNull(item.personalization.death_date),
                    portrait_photo: item.personalization.portrait_photo ?? null,
                    epitaph: item.personalization.epitaph ?? null,
                    symbol: item.personalization.symbol ?? 'NONE',
                    notes: item.personalization.notes ?? null,
                  },
                }
              : undefined,
          })),
        },
        additional_services: servicesWithPrice.length
          ? {
              create: servicesWithPrice,
            }
          : undefined,
        delivery: delivery
          ? {
              create: {
                cemetery_name: delivery.cemetery_name ?? null,
                cemetery_address: delivery.cemetery_address,
                city: delivery.city ?? null,
                region: delivery.region ?? null,
                contact_phone: delivery.contact_phone,
                preferred_date: toDateOrNull(delivery.preferred_date),
                comment: delivery.comment ?? null,
              },
            }
          : undefined,
      },
      include: {
        user: { select: { id: true, first_name: true, last_name: true, email: true, phone: true } },
        order_items: {
          include: {
            product: { select: { id: true, name: true, image: true } },
            personalization: true,
          },
        },
        additional_services: { include: { service: true } },
        delivery: true,
      },
    });
  });

  if (orderResult.user) {
    await sendOrderNotification(orderResult);
  }

  return orderResult;
}

// Поле даты, которое нужно проставить при переходе в данный статус
const STATUS_TIMESTAMP_FIELD: Partial<Record<OrderStatus, string>> = {
  PAID: 'paid_at',
  IN_PRODUCTION: 'in_production_at',
  IN_DELIVERY: 'in_delivery_at',
  COMPLETED: 'completed_at',
  CANCELLED: 'cancelled_at',
};

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { order_items: true },
  });

  if (!order) throw new OrderNotFoundError(orderId);

  if (order.status === status) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, order_items: { include: { product: true } } },
    });
  }

  if (!ALLOWED_TRANSITIONS[order.status as OrderStatus]?.includes(status)) {
    if (status === 'CANCELLED') {
      throw new OrderCannotBeCancelledError(orderId, order.status);
    }
    throw new InvalidStatusTransitionError(orderId, order.status, status);
  }

  if (status === 'CANCELLED') {
    return cancelOrder(orderId);
  }

  const timestampField = STATUS_TIMESTAMP_FIELD[status];
  const data: Record<string, unknown> = { status };
  if (timestampField) data[timestampField] = new Date();

  await prisma.order.update({
    where: { id: orderId },
    data,
  });

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, order_items: { include: { product: true } } },
  });
}

export async function cancelOrder(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { order_items: true },
  });

  if (!order) throw new OrderNotFoundError(orderId);
  if (order.status === 'CANCELLED') return order;

  if (!ALLOWED_TRANSITIONS[order.status as OrderStatus]?.includes('CANCELLED')) {
    throw new OrderCannotBeCancelledError(orderId, order.status);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.order_items) {
      if (!item.product_id) continue;
      await tx.product.update({
        where: { id: item.product_id },
        data: { stock_quantity: { increment: item.quantity } },
      });
    }
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', cancelled_at: new Date() },
    });
  });

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, order_items: { include: { product: true } } },
  });
}
