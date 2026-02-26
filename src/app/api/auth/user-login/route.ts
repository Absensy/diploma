import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Проверка пароля
    const isValidPassword = verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Создание JWT токена для пользователя
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      timestamp: Date.now(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .setIssuedAt()
      .sign(secret);

    // Создание HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Успешная авторизация',
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          is_admin: user.is_admin,
        },
      },
      { status: 200 }
    );

    response.cookies.set('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    // Если пользователь админ, создаем также admin-token
    if (user.is_admin) {
      const adminToken = await new SignJWT({
        admin: true,
        userId: user.id,
        timestamp: Date.now(),
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d')
        .setIssuedAt()
        .sign(secret);

      response.cookies.set('admin-token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
