import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type CategoryPlan = {
  category: string;
  image: string;
  materials: string;
  metaKeywords: string;
  priceMin: number;
  priceMax: number;
  names: string[];
  short: (name: string) => string;
  full: (name: string) => string;
};

const plans: CategoryPlan[] = [
  {
    category: 'Светильники',
    image: '/images/lamp.png',
    materials: 'Гранит, закалённое стекло',
    metaKeywords: 'светильники, светильники для памятников, мемориальные светильники, освещение могил, Гродно',
    priceMin: 120,
    priceMax: 280,
    names: ['Светильник "Лампада"', 'Светильник "Огонёк"', 'Светильник "Вечный свет"', 'Светильник "Свеча"'],
    short: (n) => `${n}. Светильник для памятника из прочных материалов с автоматическим включением в тёмное время суток.`,
    full: (n) =>
      `Светильник ${n} для мемориалов. Энергосберегающая светодиодная подсветка, устойчивость к влаге и перепадам температур, долгий срок службы и экономичное энергопотребление.`,
  },
  {
    category: 'Ограды',
    image: '/images/fence.png',
    materials: 'Гранит',
    metaKeywords: 'ограды, ограды на могилу, ограждения, благоустройство могил, Гродно',
    priceMin: 220,
    priceMax: 720,
    names: ['Ограда "Классика"', 'Ограда "Ажур"', 'Ограда "Гранит"', 'Ограда "Строгая"'],
    short: (n) => `${n}. Прочная ограда для благоустройства могильного участка, устойчивая к погодным условиям.`,
    full: (n) =>
      `Ограда ${n} для оформления захоронения. Изготовление из качественных материалов, аккуратная обработка, доставка и установка. Подчёркивает границы участка и придаёт ухоженный вид.`,
  },
  {
    category: 'Столы',
    image: '/images/table.png',
    materials: 'Гранит',
    metaKeywords: 'столы, мемориальные столы, столы из гранита, благоустройство могил, Гродно',
    priceMin: 300,
    priceMax: 820,
    names: ['Стол "Поминальный"', 'Стол "Гранитный"', 'Стол "Семейный"', 'Стол "Классик"'],
    short: (n) => `${n}. Мемориальный стол из гранита для комфортного поминовения. Прочный и долговечный.`,
    full: (n) =>
      `Стол ${n} для благоустройства места захоронения. Натуральный гранит, аккуратная обработка кромок, устойчивость к погодным условиям. Доставка и установка.`,
  },
  {
    category: 'Скамейки',
    image: '/images/bench.png',
    materials: 'Гранит',
    metaKeywords: 'скамейки, мемориальные скамейки, скамейки из гранита, благоустройство могил, Гродно',
    priceMin: 250,
    priceMax: 760,
    names: ['Скамейка "Покой"', 'Скамейка "Гранитная"', 'Скамейка "Уют"', 'Скамейка "Классик"'],
    short: (n) => `${n}. Мемориальная скамейка из гранита для комфортного посещения захоронения.`,
    full: (n) =>
      `Скамейка ${n} для места захоронения. Прочный гранит, удобная конструкция, устойчивость к осадкам и перепадам температур. Доставка и установка.`,
  },
];

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

function slugify(name: string): string {
  let out = '';
  for (const ch of name.toLowerCase()) out += TRANSLIT[ch] ?? ch;
  return out.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function uniqueSlug(base: string, selfId: number): Promise<string> {
  let slug = base || 'product';
  let n = 1;
  while (true) {
    const clash = await prisma.product.findFirst({
      where: { slug, NOT: { id: selfId } },
      select: { id: true },
    });
    if (!clash) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

async function uniqueSku(): Promise<string> {
  while (true) {
    const sku = `GR-${faker.string.alphanumeric(6).toUpperCase()}`;
    const clash = await prisma.product.findFirst({ where: { sku }, select: { id: true } });
    if (!clash) return sku;
  }
}

function buildPricing(min: number, max: number) {
  const price = faker.number.float({ min, max, fractionDigits: 2 });
  const hasDiscount = faker.datatype.boolean({ probability: 0.35 });
  const discount = hasDiscount ? faker.number.int({ min: 5, max: 20 }) : null;
  const discounted_price = discount ? Math.round(price * (1 - discount / 100) * 100) / 100 : null;
  return { price, discount, discounted_price };
}

function buildSpecs() {
  return {
    production_time: `${faker.number.int({ min: 3, max: 21 })} дней`,
    weight: faker.number.float({ min: 20, max: 200, fractionDigits: 2 }),
    dimensions: `${faker.number.int({ min: 40, max: 120 })}x${faker.number.int({ min: 30, max: 80 })}x${faker.number.int({ min: 5, max: 30 })}`,
    stock_quantity: faker.number.int({ min: 1, max: 10 }),
    is_new: faker.datatype.boolean({ probability: 0.3 }),
    is_popular: faker.datatype.boolean({ probability: 0.3 }),
  };
}

async function setSingleImage(productId: number, url: string, alt: string) {
  await prisma.productImage.deleteMany({ where: { product_id: productId } });
  await prisma.productImage.create({
    data: { product_id: productId, url, alt, order: 0, is_primary: true },
  });
}

async function main() {
  const allMaterials = await prisma.material.findMany({ select: { id: true, name: true } });
  const allTags = await prisma.tag.findMany({ select: { id: true } });

  for (const plan of plans) {
    const category = await prisma.category.findFirst({ where: { name: plan.category } });
    if (!category) {
      console.log(`⏭️  Категория "${plan.category}" не найдена — пропуск`);
      continue;
    }

    await prisma.category.update({ where: { id: category.id }, data: { photo: plan.image } });

    const existing = await prisma.product.findMany({
      where: { category_id: category.id },
      orderBy: { id: 'asc' },
      select: { id: true },
    });

    for (let i = 0; i < plan.names.length; i++) {
      const name = plan.names[i];
      const meta_title = `${name} — Гранитная память`;
      const meta_description = `${name}. ${plan.short(name)} Доставка и установка, г. Гродно.`.slice(0, 300);
      const shared = {
        name,
        short_description: plan.short(name),
        full_description: plan.full(name),
        materials: plan.materials,
        image: plan.image,
        meta_title,
        meta_description,
        meta_keywords: plan.metaKeywords,
        is_active: true,
        requires_personalization: false,
        stock_quantity: faker.number.int({ min: 3, max: 10 }),
      };

      if (i < existing.length) {
        const id = existing[i].id;
        const slug = await uniqueSlug(slugify(name), id);
        await prisma.product.update({ where: { id }, data: { ...shared, slug } });
        await setSingleImage(id, plan.image, name);
        console.log(`♻️  ${plan.category}: обновлён товар #${id} → ${name}`);
      } else {
        const slug = await uniqueSlug(slugify(name), -1);
        const sku = await uniqueSku();
        const pricing = buildPricing(plan.priceMin, plan.priceMax);
        const specs = buildSpecs();
        const mats = faker.helpers.arrayElements(allMaterials, { min: 1, max: 2 });
        const tagPick = faker.helpers.arrayElements(allTags, { min: 1, max: 2 });
        const created = await prisma.product.create({
          data: {
            ...shared,
            slug,
            sku,
            category_id: category.id,
            ...pricing,
            ...specs,
            images: { create: [{ url: plan.image, alt: name, order: 0, is_primary: true }] },
            product_materials: mats.length
              ? { create: mats.map((m) => ({ material_id: m.id })) }
              : undefined,
            tags: tagPick.length ? { create: tagPick.map((t) => ({ tag_id: t.id })) } : undefined,
          },
        });
        console.log(`➕ ${plan.category}: создан товар #${created.id} → ${name}`);
      }
    }

    if (existing.length > plan.names.length) {
      const extras = existing.slice(plan.names.length).map((p) => p.id);
      await prisma.product.updateMany({
        where: { id: { in: extras } },
        data: { is_active: false },
      });
      console.log(`🚫 ${plan.category}: деактивировано лишних товаров: ${extras.length}`);
    }

    const total = await prisma.product.count({
      where: { category_id: category.id, is_active: true },
    });
    console.log(`✅ ${plan.category}: активных товаров — ${total}\n`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
