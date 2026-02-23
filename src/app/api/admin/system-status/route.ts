import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - проверить статус системы
export async function GET() {
  const status = {
    database: { status: 'offline', message: 'Не подключена' },
    api: { status: 'online', message: 'Работает' },
    cloudinary: { status: 'offline', message: 'Не настроен' },
  };

  // Проверка базы данных
  try {
    await prisma.$queryRaw`SELECT 1`;
    status.database = { status: 'online', message: 'Онлайн' };
  } catch (error) {
    console.error('Database connection error:', error);
    status.database = { status: 'offline', message: 'Ошибка подключения' };
  }

  // Проверка Cloudinary
  try {
    const cloudinaryConfig = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    };

    if (cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret) {
      status.cloudinary = { status: 'online', message: 'Подключен' };
    } else {
      status.cloudinary = { status: 'offline', message: 'Не настроен' };
    }
  } catch (error) {
    console.error('Cloudinary config error:', error);
    status.cloudinary = { status: 'offline', message: 'Ошибка конфигурации' };
  }

  // API всегда работает, если мы дошли до этого места
  status.api = { status: 'online', message: 'Работает' };

  return NextResponse.json(status);
}
