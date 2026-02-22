import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const normalizedTags = tags.map((tag: any) => ({
      ...tag,
      productsCount: tag._count.products,
    }));

    return NextResponse.json(normalizedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, slug } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    if (!slug || !slug.trim()) {
      slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    console.error('Error creating tag:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create tag', details: error.message },
      { status: 500 }
    );
  }
}
