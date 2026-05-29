import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - получить все товары
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.category_id = parseInt(categoryId);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const normalizedProducts = products.map((product: any) => ({
      ...product,
      is_new: Boolean(product.is_new),
      is_popular: Boolean(product.is_popular),
      is_active: Boolean(product.is_active),
      price: Number(product.price),
      discounted_price: product.discounted_price ? Number(product.discounted_price) : null,
      weight: product.weight ? Number(product.weight) : null,
      stock_quantity: product.stock_quantity ?? null,
    }));

    return NextResponse.json(normalizedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - создать новый товар
export async function POST(request: NextRequest) {
  try {
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

    // Generate slug from name if not provided
    const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        short_description,
        full_description,
        materials,
        production_time,
        price: parseFloat(price),
        discount: discount ? parseInt(discount) : null,
        discounted_price: discounted_price ? parseFloat(discounted_price) : null,
        image,
        category_id: category_id ? parseInt(category_id) : null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        meta_keywords: meta_keywords || null,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
        sku: sku || null,
        is_new: is_new || false,
        is_popular: is_popular || false,
        is_active: is_active !== undefined ? is_active : true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product with this slug or SKU already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
