import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CONTACT_INFO_DEFAULTS = {
  address: 'пр. Янки Купалы 22а, цокольный этаж',
  phone: '+375 (29) 708-21-11',
  email: 'info@granit-grodno.by',
  instagram: 'granit.grodno',
  working_hours: 'Пн-Пт: 9:00 - 18:00, Сб-Вс: 10:00 - 16:00',
  company_name: 'ООО «Гранит памяти»',
  legal_form: 'ООО',
  director_name: '',
  director_basis: 'Устава',
  unp: '',
  legal_address: '',
  bank_name: '',
  bank_account: '',
  bik: '',
};

const UPDATABLE_FIELDS = [
  'address',
  'phone',
  'email',
  'instagram',
  'working_hours',
  'company_name',
  'legal_form',
  'director_name',
  'director_basis',
  'unp',
  'legal_address',
  'bank_name',
  'bank_account',
  'bik',
] as const;

// GET - получить контактную информацию
export async function GET() {
  try {
    let contactInfo = await prisma.contactInfo.findFirst({
      orderBy: { created_at: 'desc' }
    });

    if (!contactInfo) {
      contactInfo = await prisma.contactInfo.create({
        data: CONTACT_INFO_DEFAULTS,
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// PUT - обновить контактную информацию
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const field of UPDATABLE_FIELDS) {
      if (field in body) data[field] = body[field];
    }

    let contactInfo = await prisma.contactInfo.findFirst({
      orderBy: { created_at: 'desc' }
    });

    if (contactInfo) {
      contactInfo = await prisma.contactInfo.update({
        where: { id: contactInfo.id },
        data,
      });
    } else {
      contactInfo = await prisma.contactInfo.create({
        data: { ...CONTACT_INFO_DEFAULTS, ...data } as never,
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}
