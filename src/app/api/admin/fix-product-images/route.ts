import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LOCAL_PRODUCT_IMAGES = [
  '/uploads/product/product_1766404232698.jpg',
  '/uploads/product/product_1766404246370.jpg',
  '/uploads/product/product_1766404269490.jpg',
  '/uploads/product/product_1766404277125.jpg',
  '/uploads/product/product_1766404292137.jpg',
  '/uploads/product/product_1766404304661.jpg',
  '/uploads/product/product_1766404307445.jpg',
  '/uploads/product/product_1766404320170.jpg',
  '/uploads/product/product_1766404331582.jpg',
  '/uploads/product/product_1766404340007.jpg',
  '/uploads/product/product_1766404353469.jpg',
  '/uploads/product/product_1766404362939.jpg',
  '/uploads/product/product_1766404380024.jpg',
];

function isLocalUpload(url: string): boolean {
  return url.startsWith('/uploads/product/');
}

export async function POST() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, image: true },
    });

    const toUpdate = products.filter(
      (p) => !p.image || !isLocalUpload(p.image)
    );

    for (let i = 0; i < toUpdate.length; i++) {
      const image = LOCAL_PRODUCT_IMAGES[i % LOCAL_PRODUCT_IMAGES.length];
      await prisma.product.update({
        where: { id: toUpdate[i].id },
        data: { image },
      });
    }

    return NextResponse.json({
      success: true,
      updated: toUpdate.length,
      total: products.length,
    });
  } catch (error) {
    console.error('Error fixing product images:', error);
    return NextResponse.json({ error: 'Failed to fix images' }, { status: 500 });
  }
}
