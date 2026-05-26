import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LOCAL_SERVICE_IMAGES = [
  '/images/memorialMonument.jpg',
  '/images/doubleMonument.jpg',
  '/images/GrneyMonument.jpg',
  '/images/doubleMonuments.jpg',
];

const LOCAL_ABOUT_IMAGE = '/images/ded.png';

function isLocal(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.startsWith('/images/') || url.startsWith('/uploads/');
}

export async function POST() {
  try {
    const sections = await prisma.content.findMany({
      where: { section: { in: ['our_services', 'about_company'] } },
    });

    let fixed = 0;

    for (const row of sections) {
      const data = row.data as Record<string, unknown>;

      if (row.section === 'our_services') {
        const services = data.ourServices as Array<{ id: number; name: string; subtext: string; image: string }> | undefined;
        if (!Array.isArray(services)) continue;

        const updated = services.map((s, i) => ({
          ...s,
          image: isLocal(s.image) ? s.image : LOCAL_SERVICE_IMAGES[i % LOCAL_SERVICE_IMAGES.length],
        }));

        const hasChanges = updated.some((s, i) => s.image !== services[i].image);
        if (hasChanges) {
          await prisma.content.update({
            where: { id: row.id },
            data: { data: { ...data, ourServices: updated } },
          });
          fixed++;
        }
      }

      if (row.section === 'about_company') {
        const img = data.image as string | undefined;
        if (!isLocal(img)) {
          await prisma.content.update({
            where: { id: row.id },
            data: { data: { ...data, image: LOCAL_ABOUT_IMAGE } },
          });
          fixed++;
        }
      }
    }

    return NextResponse.json({ success: true, fixed, total: sections.length });
  } catch (error) {
    console.error('Error fixing content images:', error);
    return NextResponse.json({ error: 'Failed to fix content images' }, { status: 500 });
  }
}
