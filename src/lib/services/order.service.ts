import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class InsufficientStockError extends Error {
  constructor(
    public productId: number,
    public productName: string,
    public requested: number,
    public available: number
  ) {
    super(
      `Недостаточно товара "${productName}" на складе: запрошено ${requested}, доступно ${available}`
    );
    this.name = 'InsufficientStockError';
  }
}

export class ProductNotFoundOrInactiveError extends Error {
  constructor(public productId: number, message: string) {
    super(message);
    this.name = 'ProductNotFoundOrInactiveError';
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

export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: number;
  orderItems: OrderItemInput[];
  paymentMethod?: 'ONLINE' | 'OFFLINE';
}

/**
 * Создаёт заказ со статусом PENDING_CONFIRMATION и атомарным списанием остатков.
 * Защита от overselling и race condition за счёт транзакции и
 * условного UPDATE (stock_quantity >= quantity).
 */
export async function createOrderWithInventory(input: CreateOrderInput) {
  const { userId, orderItems, paymentMethod = 'OFFLINE' } = input;

  if (!orderItems.length) {
    throw new Error('Заказ должен содержать хотя бы один товар');
  }

  const orderResult = await prisma.$transaction(async (tx) => {
    const itemsWithPrice: Array<{
      product_id: number;
      quantity: number;
      price_at_purchase: Prisma.Decimal;
      productName: string;
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
        },
      });

      if (!product) {
        throw new ProductNotFoundOrInactiveError(
          item.product_id,
          `Товар с ID ${item.product_id} не найден`
        );
      }

      if (!product.is_active) {
        throw new ProductNotFoundOrInactiveError(
          item.product_id,
          `Товар "${product.name}" недоступен для заказа`
        );
      }

      const available = product.stock_quantity ?? 0;
      if (available < item.quantity) {
        throw new InsufficientStockError(
          product.id,
          product.name,
          item.quantity,
          available
        );
      }

      const price = product.discounted_price ?? product.price;
      const priceNum = Number(price);
      const itemTotal = priceNum * item.quantity;
      totalAmount += itemTotal;

      itemsWithPrice.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: price,
        productName: product.name,
      });
    }

    // Атомарное списание остатков: только если stock_quantity >= quantity
    for (const item of itemsWithPrice) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.product_id,
          stock_quantity: { gte: item.quantity },
        },
        data: {
          stock_quantity: { decrement: item.quantity },
        },
      });

      if (updated.count !== 1) {
        const product = await tx.product.findUnique({
          where: { id: item.product_id },
          select: { name: true, stock_quantity: true },
        });
        const current = product?.stock_quantity ?? 0;
        throw new InsufficientStockError(
          item.product_id,
          item.productName,
          item.quantity,
          current
        );
      }
    }

    const order = await tx.order.create({
      data: {
        user_id: userId,
        status: 'PENDING_CONFIRMATION',
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
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return order;
  });

  return orderResult;
}

/**
 * Отменяет заказ и возвращает товары на склад.
 * Допустимо только для заказов в статусе PENDING_CONFIRMATION или CONFIRMED.
 */
export async function cancelOrder(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      order_items: {
        include: {
          product: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!order) {
    throw new OrderNotFoundError(orderId);
  }

  if (order.status === 'CANCELLED') {
    return order;
  }

  if (order.status === 'PAID') {
    throw new OrderCannotBeCancelledError(orderId, order.status);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.order_items) {
      if (item.product_id == null) continue;
      await tx.product.update({
        where: { id: item.product_id },
        data: {
          stock_quantity: { increment: item.quantity },
        },
      });
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  });

  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      order_items: { include: { product: true } },
    },
  });
}

/**
 * Обновляет статус заказа. При переходе в CANCELLED возвращает товары на склад.
 */
export async function updateOrderStatus(
  orderId: number,
  newStatus: 'CONFIRMED' | 'PAID' | 'CANCELLED'
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, confirmed_at: true, paid_at: true },
  });

  if (!order) {
    throw new OrderNotFoundError(orderId);
  }

  const allowedTransitions: Record<string, string[]> = {
    PENDING_CONFIRMATION: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PAID', 'CANCELLED'],
    PAID: [],
    CANCELLED: [],
  };

  const allowed = allowedTransitions[order.status];
  if (!allowed?.includes(newStatus)) {
    throw new Error(
      `Недопустимый переход статуса: ${order.status} → ${newStatus}`
    );
  }

  if (newStatus === 'CANCELLED') {
    const cancelled = await cancelOrder(orderId);
    if (!cancelled) throw new OrderNotFoundError(orderId);
    return cancelled;
  }

  const updateData: { status: string; confirmed_at?: Date; paid_at?: Date } = {
    status: newStatus,
  };
  if (newStatus === 'CONFIRMED') {
    updateData.confirmed_at = new Date();
  }
  if (newStatus === 'PAID') {
    updateData.paid_at = new Date();
  }

  return prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: {
      user: true,
      order_items: { include: { product: true } },
    },
  });
}
