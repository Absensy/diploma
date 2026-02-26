import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get tag by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...tag,
      productsCount: tag._count.products,
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// PUT - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    let { name, slug } = body;

    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { error: 'Tag name cannot be empty' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name.trim();
      // Auto-generate slug if name changed and slug not provided
      if (!slug) {
        updateData.slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
    }
    if (slug !== undefined) updateData.slug = slug.trim();

    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(tag);
  } catch (error: any) {
    console.error('Error updating tag:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update tag', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if tag is used in products
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    if (tag._count.products > 0) {
      return NextResponse.json(
        { error: `Cannot delete tag. It is used in ${tag._count.products} product(s).` },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting tag:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete tag', details: error.message },
      { status: 500 }
    );
  }
}
