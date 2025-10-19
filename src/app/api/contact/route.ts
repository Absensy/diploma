import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { address, phone, email, instagram, working_hours } = await request.json();
    
    // Создаем новую запись (так как у нас нет уникального ключа для upsert)
    const contactInfo = await prisma.contactInfo.create({
      data: {
        address,
        phone,
        email,
        instagram,
        working_hours
      }
    });
    
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}

