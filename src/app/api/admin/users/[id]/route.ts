import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

// GET - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
        orders: {
          take: 5,
          orderBy: {
            order_date: 'desc',
          },
          select: {
            id: true,
            order_date: true,
            status: true,
            total_amount: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...user,
      ordersCount: user._count.orders,
      password: undefined, // Don't return password
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { first_name, last_name, email, password, phone, is_admin } = body;

    const updateData: any = {};
    if (first_name !== undefined) updateData.first_name = first_name.trim();
    if (last_name !== undefined) updateData.last_name = last_name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (password !== undefined) updateData.password = hashPassword(password);
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (is_admin !== undefined) updateData.is_admin = is_admin;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData as any,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        is_admin: true,
        created_at: true,
      } as any,
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if user has orders
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user._count.orders > 0) {
      return NextResponse.json(
        { error: `Cannot delete user. They have ${user._count.orders} order(s).` },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}
