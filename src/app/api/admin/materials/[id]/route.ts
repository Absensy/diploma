import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get material by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const material = await prisma.material.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...material,
      productsCount: material._count.products,
    });
  } catch (error) {
    console.error('Error fetching material:', error);
    return NextResponse.json(
      { error: 'Failed to fetch material' },
      { status: 500 }
    );
  }
}

// PUT - Update material
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { error: 'Material name cannot be empty' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;

    const material = await prisma.material.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(material);
  } catch (error: any) {
    console.error('Error updating material:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Material with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update material', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete material
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if material is used in products
    const material = await prisma.material.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    if (material._count.products > 0) {
      return NextResponse.json(
        { error: `Cannot delete material. It is used in ${material._count.products} product(s).` },
        { status: 400 }
      );
    }

    await prisma.material.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Material deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting material:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete material', details: error.message },
      { status: 500 }
    );
  }
}
