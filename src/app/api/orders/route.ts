import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';
import {
  createOrderWithInventory,
  InsufficientStockError,
  ProductNotFoundOrInactiveError,
} from '@/lib/services/order.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

async function getUserId(request: NextRequest): Promise<number | null> {
  try {
    const token = request.cookies.get('user-token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload.userId ? Number(payload.userId) : null;
  } catch {
    return null;
  }
}

// POST - Создание заказа (атомарное списание остатков в транзакции)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_items, payment_method } = body;

    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return NextResponse.json(
        { error: 'Заказ должен содержать хотя бы один товар' },
        { status: 400 }
      );
    }

    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Для оформления заказа необходимо авторизоваться' },
        { status: 401 }
      );
    }

    const orderItems = order_items.map((item: { product_id: number; quantity: number }) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const order = await createOrderWithInventory({
      userId,
      orderItems,
      paymentMethod: payment_method === 'OFFLINE' ? 'OFFLINE' : 'ONLINE',
    });

    revalidatePath('/catalog');
    revalidatePath('/api/products');
    revalidatePath('/api/filters');

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          order_date: order.order_date,
          status: order.status,
          total_amount: Number(order.total_amount),
          payment_method: order.payment_method,
          items: order.order_items,
        },
        message: 'Заказ успешно создан. С вами свяжется менеджер для уточнения деталей.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    if (error instanceof ProductNotFoundOrInactiveError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        error: 'Ошибка при создании заказа',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
