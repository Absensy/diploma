import { PrismaClient } from '@prisma/client';

const DEFAULT_OUR_SERVICES = [
  { id: 1, name: 'Памятники и надгробия', subtext: 'Изготовление памятников, надгробий и мемориальных комплексов из гранита и мрамора', image: '/images/tools.svg' },
  { id: 2, name: 'Венки и цветы', subtext: 'Красивые венки из искусственных и живых цветов для украшения могил', image: '/images/pen.svg' },
  { id: 3, name: 'Светильники и освещение', subtext: 'Настенные и напольные светильники из гранита с LED подсветкой', image: '/images/hammer.svg' },
  { id: 4, name: 'Ограды и ограждения', subtext: 'Прочные ограды из гранита для благоустройства могильных участков', image: '/images/tools.svg' },
  { id: 5, name: 'Столы и скамейки', subtext: 'Мемориальные столы и скамейки из гранита для комфортного поминовения', image: '/images/pen.svg' },
  { id: 6, name: 'Гравировка и установка', subtext: 'Нанесение текста, изображений и профессиональная установка всех изделий', image: '/images/hammer.svg' },
];

const prisma = new PrismaClient();

await prisma.content.upsert({
  where: { section: 'our_services' },
  update: {
    data: { ourServices: DEFAULT_OUR_SERVICES },
    updated_at: new Date(),
  },
  create: {
    section: 'our_services',
    data: { ourServices: DEFAULT_OUR_SERVICES },
  },
});

console.log('✅ our_services: tools → pen → hammer (×2)');
await prisma.$disconnect();
