import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - получить товар по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...product,
      is_new: Boolean(product.is_new),
      is_popular: Boolean(product.is_popular),
      is_active: Boolean(product.is_active),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - обновить товар
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      short_description,
      full_description,
      materials,
      production_time,
      price,
      discount,
      discounted_price,
      image,
      category_id,
      meta_title,
      meta_description,
      meta_keywords,
      weight,
      dimensions,
      stock_quantity,
      sku,
      is_new,
      is_popular,
      is_active,
    } = body;

    // Generate slug from name if not provided and name is being updated
    let productSlug = slug;
    if (name !== undefined && !slug) {
      productSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (productSlug !== undefined) updateData.slug = productSlug;
    if (short_description !== undefined) updateData.short_description = short_description;
    if (full_description !== undefined) updateData.full_description = full_description;
    if (materials !== undefined) updateData.materials = materials;
    if (production_time !== undefined) updateData.production_time = production_time;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (discount !== undefined) updateData.discount = discount ? parseInt(discount) : null;
    if (discounted_price !== undefined) updateData.discounted_price = discounted_price ? parseFloat(discounted_price) : null;
    if (image !== undefined) updateData.image = image;
    if (category_id !== undefined) updateData.category_id = category_id ? parseInt(category_id) : null;
    if (meta_title !== undefined) updateData.meta_title = meta_title || null;
    if (meta_description !== undefined) updateData.meta_description = meta_description || null;
    if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords || null;
    if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null;
    if (dimensions !== undefined) updateData.dimensions = dimensions || null;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity ? parseInt(stock_quantity) : null;
    if (sku !== undefined) updateData.sku = sku || null;
    if (is_new !== undefined) updateData.is_new = is_new;
    if (is_popular !== undefined) updateData.is_popular = is_popular;
    if (is_active !== undefined) updateData.is_active = is_active;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product with this slug or SKU already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - удалить товар
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
