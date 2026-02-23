import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - получить все услуги
export async function GET() {
  try {
    const services = await prisma.content.findFirst({
      where: { section: 'our_services' }
    });

    if (!services) {
      // Возвращаем дефолтные значения если контент не найден
      return NextResponse.json({
        ourServices: [
          {
            id: 1,
            name: 'Памятники и надгробия',
            subtext: 'Изготовление памятников, надгробий и мемориальных комплексов из гранита и мрамора',
            image: '/images/tools.svg'
          },
          {
            id: 2,
            name: 'Венки и цветы',
            subtext: 'Красивые венки из искусственных и живых цветов для украшения могил',
            image: '/images/pen.svg'
          },
          {
            id: 3,
            name: 'Светильники и освещение',
            subtext: 'Настенные и напольные светильники из гранита с LED подсветкой',
            image: '/images/hammer.svg'
          },
          {
            id: 4,
            name: 'Ограды и ограждения',
            subtext: 'Прочные ограды из гранита для благоустройства могильных участков',
            image: '/images/tools.svg'
          },
          {
            id: 5,
            name: 'Столы и скамейки',
            subtext: 'Мемориальные столы и скамейки из гранита для комфортного поминовения',
            image: '/images/pen.svg'
          },
          {
            id: 6,
            name: 'Гравировка и установка',
            subtext: 'Нанесение текста, изображений и профессиональная установка всех изделий',
            image: '/images/hammer.svg'
          }
        ]
      });
    }

    return NextResponse.json(services.data);
  } catch (error) {
    console.error('Error fetching our services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// PUT - обновить услуги
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ourServices } = body;

    const content = await prisma.content.upsert({
      where: { section: 'our_services' },
      update: {
        data: { ourServices },
        updated_at: new Date()
      },
      create: {
        section: 'our_services',
        data: { ourServices }
      }
    });

    return NextResponse.json(content.data);
  } catch (error) {
    console.error('Error updating our services:', error);
    return NextResponse.json(
      { error: 'Failed to update services' },
      { status: 500 }
    );
  }
}



