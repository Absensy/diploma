import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('user-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'Токен не найден' },
        { status: 401 }
      );
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (!payload.userId) {
        return NextResponse.json(
          { authenticated: false, error: 'Неверный токен' },
          { status: 401 }
        );
      }

      const userId = typeof payload.userId === 'number' 
        ? payload.userId 
        : parseInt(payload.userId as string, 10);

      if (isNaN(userId)) {
        return NextResponse.json(
          { authenticated: false, error: 'Неверный токен' },
          { status: 401 }
        );
      }

      // Получаем актуальные данные пользователя из БД
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      if (!user) {
        return NextResponse.json(
          { authenticated: false, error: 'Пользователь не найден' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          authenticated: true,
          user,
        },
        { status: 200 }
      );
    } catch (jwtError) {
      return NextResponse.json(
        { authenticated: false, error: 'Недействительный токен' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
