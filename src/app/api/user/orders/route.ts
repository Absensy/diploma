import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Получить заказы текущего пользователя
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('user-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Проверка токена
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload.userId) {
      return NextResponse.json(
        { error: 'Неверный токен' },
        { status: 401 }
      );
    }

    const userId = typeof payload.userId === 'number' 
      ? payload.userId 
      : parseInt(payload.userId as string, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Неверный токен' },
        { status: 401 }
      );
    }

    // Получаем заказы пользователя
    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                discounted_price: true,
              },
            },
          },
        },
      },
      orderBy: {
        order_date: 'desc',
      },
    });

    const normalizedOrders = orders.map((order: any) => ({
      ...order,
      total_amount: order.total_amount ? Number(order.total_amount) : null,
      order_items: order.order_items.map((item: any) => ({
        ...item,
        price_at_purchase: Number(item.price_at_purchase),
        product: {
          ...item.product,
          price: Number(item.product.price),
          discounted_price: item.product.discounted_price ? Number(item.product.discounted_price) : null,
        },
      })),
    }));

    return NextResponse.json(normalizedOrders);
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    
    if (error.code === 'ERR_JWT_INVALID' || error.code === 'ERR_JWT_EXPIRED') {
      return NextResponse.json(
        { error: 'Токен недействителен' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при получении заказов' },
      { status: 500 }
    );
  }
}
