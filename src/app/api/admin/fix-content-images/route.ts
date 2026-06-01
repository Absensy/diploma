import { NextResponse } from 'next/server';
import { prisma, toInputJson } from '@/lib/prisma';
import {
  DEFAULT_OUR_SERVICES,
  isLocalContentImage,
  normalizeOurServices,
  type OurServiceItem,
} from '@/lib/defaultOurServices';

const LOCAL_ABOUT_IMAGE = '/images/ded.png';

export async function POST() {
  try {
    const sections = await prisma.content.findMany({
      where: { section: { in: ['our_services', 'about_company'] } },
    });

    let fixed = 0;

    for (const row of sections) {
      const data = row.data as Record<string, unknown>;

      if (row.section === 'our_services') {
        const services = data.ourServices as OurServiceItem[] | undefined;
        const normalized = normalizeOurServices(services);
        const hasChanges =
          !Array.isArray(services) ||
          normalized.ourServices.some((s, i) => s.image !== services[i]?.image);

        if (hasChanges) {
          await prisma.content.upsert({
            where: { section: 'our_services' },
            update: { data: toInputJson(normalized), updated_at: new Date() },
            create: { section: 'our_services', data: toInputJson(normalized) },
          });
          fixed++;
        }
      }

      if (row.section === 'about_company') {
        const img = data.image as string | undefined;
        if (!isLocalContentImage(img)) {
          await prisma.content.update({
            where: { id: row.id },
            data: { data: { ...data, image: LOCAL_ABOUT_IMAGE } },
          });
          fixed++;
        }
      }
    }

    const hasOurServices = sections.some((s) => s.section === 'our_services');
    if (!hasOurServices) {
      await prisma.content.upsert({
        where: { section: 'our_services' },
        update: {
          data: toInputJson({ ourServices: DEFAULT_OUR_SERVICES }),
          updated_at: new Date(),
        },
        create: {
          section: 'our_services',
          data: toInputJson({ ourServices: DEFAULT_OUR_SERVICES }),
        },
      });
      fixed++;
    }

    return NextResponse.json({ success: true, fixed, total: sections.length });
  } catch (error) {
    console.error('Error fixing content images:', error);
    return NextResponse.json({ error: 'Failed to fix content images' }, { status: 500 });
  }
}
