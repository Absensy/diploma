import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { hashPassword } from '@/lib/password';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Получить профиль текущего пользователя
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('user-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    
    if (error.code === 'ERR_JWT_INVALID' || error.code === 'ERR_JWT_EXPIRED') {
      return NextResponse.json(
        { error: 'Токен недействителен' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при получении профиля' },
      { status: 500 }
    );
  }
}

// Обновить профиль текущего пользователя
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('user-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

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

    const body = await request.json();
    const { first_name, last_name, phone, password } = body;

    const updateData: any = {};
    if (first_name !== undefined) updateData.first_name = first_name.trim();
    if (last_name !== undefined) updateData.last_name = last_name.trim();
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (password !== undefined && password.trim()) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Пароль должен содержать минимум 6 символов' },
          { status: 400 }
        );
      }
      updateData.password = hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        created_at: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    
    if (error.code === 'ERR_JWT_INVALID' || error.code === 'ERR_JWT_EXPIRED') {
      return NextResponse.json(
        { error: 'Токен недействителен' },
        { status: 401 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при обновлении профиля' },
      { status: 500 }
    );
  }
}
