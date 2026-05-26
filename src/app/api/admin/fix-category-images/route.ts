import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LOCAL_CATEGORY_IMAGES = [
  '/uploads/category/category_1766404396936.jpg',
  '/uploads/category/category_1766404400663.jpg',
  '/uploads/category/category_1766404414959.jpg',
  '/uploads/category/category_1766404423318.jpg',
  '/images/doubleMonument.jpg',
  '/images/doubleMonuments.jpg',
  '/images/memorialMonument.jpg',
  '/images/GrneyMonument.jpg',
];

function isLocalPath(url: string): boolean {
  return url.startsWith('/uploads/') || url.startsWith('/images/');
}

export async function POST() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, photo: true },
    });

    const toUpdate = categories.filter(
      (c) => !c.photo || !isLocalPath(c.photo)
    );

    for (let i = 0; i < toUpdate.length; i++) {
      const photo = LOCAL_CATEGORY_IMAGES[i % LOCAL_CATEGORY_IMAGES.length];
      await prisma.category.update({
        where: { id: toUpdate[i].id },
        data: { photo },
      });
    }

    return NextResponse.json({
      success: true,
      updated: toUpdate.length,
      total: categories.length,
    });
  } catch (error) {
    console.error('Error fixing category images:', error);
    return NextResponse.json({ error: 'Failed to fix images' }, { status: 500 });
  }
}
