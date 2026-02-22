import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where: Record<string, unknown> = {};
    
    if (status) {
      where.status = status;
    }

    if (userId) {
      where.user_id = parseInt(userId);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
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
        _count: {
          select: {
            order_items: true,
          },
        },
      },
      orderBy: {
        order_date: 'desc',
      },
    });

    const normalizedOrders = orders.map((order: any) => ({
      ...order,
      itemsCount: order._count.order_items,
      total_amount: order.total_amount ? Number(order.total_amount) : null,
    }));

    return NextResponse.json(normalizedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, status, payment_method, order_items } = body;

    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return NextResponse.json(
        { error: 'Order must have at least one item' },
        { status: 400 }
      );
    }

    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of order_items) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
        select: { price: true, discounted_price: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.product_id} not found` },
          { status: 400 }
        );
      }

      const price = product.discounted_price ? Number(product.discounted_price) : Number(product.price);
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase || price,
      });
    }

    const order = await prisma.order.create({
      data: {
        user_id: user_id ? parseInt(user_id) : null,
        status: status || 'PENDING',
        payment_method: payment_method || 'ONLINE',
        total_amount: totalAmount,
        order_items: {
          create: orderItemsData,
        },
      },
      include: {
        user: true,
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
