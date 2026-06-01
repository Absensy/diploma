import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  DEFAULT_OUR_SERVICES,
  normalizeOurServices,
  type OurServiceItem,
} from '@/lib/defaultOurServices';

// GET - получить все услуги
export async function GET() {
  try {
    const services = await prisma.content.findFirst({
      where: { section: 'our_services' }
    });

    if (!services) {
      return NextResponse.json({ ourServices: DEFAULT_OUR_SERVICES });
    }

    const data = services.data as { ourServices?: OurServiceItem[] };
    return NextResponse.json(normalizeOurServices(data.ourServices));
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



