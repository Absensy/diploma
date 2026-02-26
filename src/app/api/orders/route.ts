import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

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

// POST - Создание заказа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_items, payment_method, customer_info } = body;

    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return NextResponse.json(
        { error: 'Заказ должен содержать хотя бы один товар' },
        { status: 400 }
      );
    }

    // Получаем ID пользователя - авторизация обязательна
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Для оформления заказа необходимо авторизоваться' },
        { status: 401 }
      );
    }

    // Проверяем товары и рассчитываем общую сумму
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of order_items) {
      const product = await prisma.product.findUnique({
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
        return NextResponse.json(
          { error: `Товар с ID ${item.product_id} не найден` },
          { status: 400 }
        );
      }

      if (!product.is_active) {
        return NextResponse.json(
          { error: `Товар "${product.name}" недоступен для заказа` },
          { status: 400 }
        );
      }

      // Проверка остатков
      if (product.stock_quantity !== null && product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Недостаточно товара "${product.name}" на складе` },
          { status: 400 }
        );
      }

      const price = product.discounted_price ? Number(product.discounted_price) : Number(product.price);
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: price,
      });
    }

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        status: 'PENDING',
        payment_method: payment_method || 'ONLINE',
        total_amount: Math.round(totalAmount * 100) / 100,
        order_items: {
          create: orderItemsData,
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
        message: 'Заказ успешно создан'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заказа', details: error.message },
      { status: 500 }
    );
  }
}
