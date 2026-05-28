import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  updateOrderStatus,
  OrderNotFoundError,
  OrderCannotBeCancelledError,
  InvalidStatusTransitionError,
} from '@/lib/services/order.service';
import { ORDER_STATUS_LIST, type OrderStatus } from '@/lib/orderStatus';

// GET - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
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
                price: true,
                discounted_price: true,
              },
            },
            personalization: true,
          },
        },
        additional_services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                category: true,
                unit: true,
              },
            },
          },
        },
        delivery: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...order,
      total_amount: order.total_amount ? Number(order.total_amount) : null,
      order_items: order.order_items.map((item) => ({
        ...item,
        price_at_purchase: Number(item.price_at_purchase),
        product: item.product
          ? {
              ...item.product,
              price: Number(item.product.price),
              discounted_price:
                item.product.discounted_price !== null
                  ? Number(item.product.discounted_price)
                  : null,
            }
          : null,
      })),
      additional_services: order.additional_services.map((row) => ({
        ...row,
        quantity: Number(row.quantity),
        price_at_purchase: Number(row.price_at_purchase),
      })),
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - Update order (status changes go through updateOrderStatus; CANCELLED returns stock)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status, payment_method, user_id } = body;

    if (status !== undefined && ORDER_STATUS_LIST.includes(status as OrderStatus)) {
      const order = await updateOrderStatus(orderId, status as OrderStatus);
      revalidatePath('/admin/orders');
      if (status === 'CANCELLED') {
        revalidatePath('/catalog');
        revalidatePath('/api/products');
      }
      return NextResponse.json({
        ...order,
        total_amount: order?.total_amount ? Number(order.total_amount) : null,
      });
    }

    const updateData: Record<string, unknown> = {};
    if (payment_method !== undefined) updateData.payment_method = payment_method;
    if (user_id !== undefined) updateData.user_id = user_id ? parseInt(user_id) : null;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: true,
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...order,
      total_amount: order.total_amount ? Number(order.total_amount) : null,
    });
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    if (error instanceof OrderCannotBeCancelledError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    if (error instanceof InvalidStatusTransitionError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.order.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting order:', error);
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error: 'Failed to delete order',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
