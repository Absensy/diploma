import { PrismaClient, ServiceCategory, ServiceUnit } from '@prisma/client';

const prisma = new PrismaClient();

interface ServiceSeed {
  name: string;
  description: string;
  price: number;
  unit: ServiceUnit;
  category: ServiceCategory;
  display_order: number;
}

const services: ServiceSeed[] = [
  // ─── Доставка ────────────────────────────────────────────────
  {
    name: 'Доставка по Гродно',
    description: 'Доставка памятника и комплектующих в пределах города Гродно.',
    price: 50,
    unit: ServiceUnit.PER_ORDER,
    category: ServiceCategory.DELIVERY,
    display_order: 10,
  },
  {
    name: 'Доставка по Гродненской области',
    description: 'Доставка за пределы Гродно (до 80 км). Стоимость уточняется при оформлении.',
    price: 150,
    unit: ServiceUnit.PER_ORDER,
    category: ServiceCategory.DELIVERY,
    display_order: 20,
  },

  // ─── Установка ───────────────────────────────────────────────
  {
    name: 'Установка памятника с бетонным фундаментом',
    description: 'Полный цикл: заливка фундамента, установка памятника, выравнивание. Гарантия 5 лет.',
    price: 350,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.INSTALLATION,
    display_order: 10,
  },
  {
    name: 'Установка памятника на готовый фундамент',
    description: 'Установка на уже имеющийся фундамент с фиксацией и выравниванием.',
    price: 150,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.INSTALLATION,
    display_order: 20,
  },
  {
    name: 'Установка двойного памятника с фундаментом',
    description: 'Усиленный фундамент и установка для двойных памятников и мемориальных комплексов.',
    price: 500,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.INSTALLATION,
    display_order: 30,
  },

  // ─── Демонтаж ────────────────────────────────────────────────
  {
    name: 'Демонтаж старого памятника',
    description: 'Аккуратный демонтаж существующего памятника. Утилизация по согласованию.',
    price: 200,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.DEMOLITION,
    display_order: 10,
  },
  {
    name: 'Вывоз строительного мусора',
    description: 'Вывоз грунта и строительного мусора после демонтажа или установки.',
    price: 100,
    unit: ServiceUnit.PER_ORDER,
    category: ServiceCategory.DEMOLITION,
    display_order: 20,
  },

  // ─── Благоустройство ─────────────────────────────────────────
  {
    name: 'Укладка тротуарной плитки',
    description: 'Подготовка основания и укладка плитки вокруг памятника. Цена за м².',
    price: 80,
    unit: ServiceUnit.PER_SQM,
    category: ServiceCategory.LANDSCAPING,
    display_order: 10,
  },
  {
    name: 'Гранитный цветник',
    description: 'Изготовление и установка гранитного цветника. Размер согласовывается отдельно.',
    price: 250,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.LANDSCAPING,
    display_order: 20,
  },
  {
    name: 'Металлическая ограда',
    description: 'Изготовление и установка ограды из металла. Цена за погонный метр.',
    price: 90,
    unit: ServiceUnit.PER_METER,
    category: ServiceCategory.LANDSCAPING,
    display_order: 30,
  },

  // ─── Дополнительная гравировка ───────────────────────────────
  {
    name: 'Гравировка портрета (компьютерная)',
    description: 'Лазерная гравировка портрета по фото на гранитной плите.',
    price: 250,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.ENGRAVING,
    display_order: 10,
  },
  {
    name: 'Гравировка портрета (ручная)',
    description: 'Ручная художественная гравировка портрета. Срок изготовления — до 14 дней.',
    price: 600,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.ENGRAVING,
    display_order: 20,
  },
  {
    name: 'Дополнительная эпитафия',
    description: 'Гравировка дополнительного текста сверх стандартных надписей.',
    price: 80,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.ENGRAVING,
    display_order: 30,
  },
  {
    name: 'Гравировка религиозного символа',
    description: 'Гравировка креста, полумесяца, звезды Давида или другого символа.',
    price: 50,
    unit: ServiceUnit.PER_ITEM,
    category: ServiceCategory.ENGRAVING,
    display_order: 40,
  },
];

async function main() {
  console.log('🔧 Seeding additional services...\n');

  let created = 0;
  let updated = 0;

  for (const service of services) {
    const existing = await prisma.additionalService.findFirst({
      where: { name: service.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.additionalService.update({
        where: { id: existing.id },
        data: service,
      });
      updated += 1;
    } else {
      await prisma.additionalService.create({ data: service });
      created += 1;
    }
  }

  console.log(`✅ Услуги обработаны: создано ${created}, обновлено ${updated}`);
  console.log(`📊 Всего активных услуг: ${services.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding additional services:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
