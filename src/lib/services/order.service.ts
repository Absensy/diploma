import { prisma } from '@/lib/prisma';
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

// --- ИНТЕРФЕЙСЫ ---

export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: number;
  orderItems: OrderItemInput[];
  paymentMethod?: 'ONLINE' | 'OFFLINE';
}

// --- ОСНОВНАЯ ЛОГИКА ---

export async function createOrderWithInventory(input: CreateOrderInput) {
  const { userId, orderItems, paymentMethod = 'OFFLINE' } = input;

  if (!orderItems.length) {
    throw new Error('Заказ должен содержать хотя бы один товар');
  }

  const orderResult = await prisma.$transaction(async (tx) => {
    const itemsWithPrice = [];
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

      const price = product.discounted_price ?? product.price;
      totalAmount += Number(price) * item.quantity;

      itemsWithPrice.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: price,
        productName: product.name,
      });
    }

    for (const item of itemsWithPrice) {
      const updated = await tx.product.updateMany({
        where: { id: item.product_id, stock_quantity: { gte: item.quantity } },
        data: { stock_quantity: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        throw new InsufficientStockError(item.product_id, item.productName, item.quantity, 0);
      }
    }

    return await tx.order.create({
      data: {
        user_id: userId,
        status: 'NEW',
        payment_method: paymentMethod,
        total_amount: Math.round(totalAmount * 100) / 100,
        order_items: {
          create: itemsWithPrice.map(({ product_id, quantity, price_at_purchase }) => ({
            product_id,
            quantity,
            price_at_purchase,
          })),
        },
      },
      include: {
        user: { select: { id: true, first_name: true, last_name: true, email: true, phone: true } },
        order_items: { include: { product: { select: { id: true, name: true, image: true } } } },
      },
    });
  });

  await sendOrderNotification(orderResult);
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
