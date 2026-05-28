import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.additionalService.findMany({
      where: { is_active: true },
      orderBy: [{ category: 'asc' }, { display_order: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        unit: true,
        category: true,
      },
    });

    return NextResponse.json({
      services: services.map((s) => ({
        ...s,
        price: Number(s.price),
      })),
    });
  } catch (error) {
    console.error('Error fetching additional services:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить список услуг' },
      { status: 500 },
    );
  }
}
