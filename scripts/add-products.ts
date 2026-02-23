import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Функция для генерации slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Функция для генерации SKU
function generateSKU(prefix: string = 'GR'): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

// Товары для каждой категории
const productsByCategory: Record<string, Array<{
  name: string;
  short_description: string;
  full_description: string;
  materials: string;
  production_time: string;
  price: number;
  discount?: number;
  image: string;
  is_new?: boolean;
  is_popular?: boolean;
}>> = {
  'Венки': [
    {
      name: 'Венок классический',
      short_description: 'Традиционный венок из искусственных цветов',
      full_description: 'Красивый классический венок из качественных искусственных цветов. Подходит для украшения могил и памятников. Долговечный и устойчивый к погодным условиям.',
      materials: 'Искусственные цветы, проволока, зелень',
      production_time: '1-2 дня',
      price: 50,
      image: '/images/venki-1.jpg',
      is_new: false,
      is_popular: true,
    },
    {
      name: 'Венок премиум',
      short_description: 'Роскошный венок с живыми цветами',
      full_description: 'Премиальный венок из свежих цветов. Идеально подходит для особых случаев и памятных дат. Выполнен вручную опытными мастерами.',
      materials: 'Живые цветы, зелень, декоративные элементы',
      production_time: '2-3 дня',
      price: 120,
      discount: 10,
      image: '/images/venki-2.jpg',
      is_new: true,
      is_popular: true,
    },
    {
      name: 'Венок мини',
      short_description: 'Компактный венок для небольших памятников',
      full_description: 'Небольшой элегантный венок, идеально подходящий для компактных памятников. Качественное исполнение и привлекательный внешний вид.',
      materials: 'Искусственные цветы, проволока',
      production_time: '1 день',
      price: 35,
      image: '/images/venki-3.jpg',
      is_new: false,
      is_popular: false,
    },
  ],
  'Светильники': [
    {
      name: 'Светильник настенный',
      short_description: 'Элегантный настенный светильник из гранита',
      full_description: 'Красивый настенный светильник из натурального гранита. Обеспечивает мягкое освещение и создает уютную атмосферу. Устойчив к погодным условиям.',
      materials: 'Гранит, металл, стекло',
      production_time: '5-7 дней',
      price: 150,
      image: '/images/svetilniki-1.jpg',
      is_new: true,
      is_popular: true,
    },
    {
      name: 'Светильник напольный',
      short_description: 'Стационарный напольный светильник',
      full_description: 'Прочный напольный светильник из гранита и металла. Идеально подходит для установки рядом с памятниками. Долговечный и надежный.',
      materials: 'Гранит, нержавеющая сталь, стекло',
      production_time: '7-10 дней',
      price: 250,
      discount: 15,
      image: '/images/svetilniki-2.jpg',
      is_new: false,
      is_popular: true,
    },
    {
      name: 'Светильник LED',
      short_description: 'Современный светильник с LED подсветкой',
      full_description: 'Современный энергосберегающий светильник с LED подсветкой. Автоматическое включение в темное время суток. Долгий срок службы.',
      materials: 'Гранит, металл, LED элементы',
      production_time: '7-10 дней',
      price: 300,
      image: '/images/svetilniki-3.jpg',
      is_new: true,
      is_popular: false,
    },
  ],
  'Ограды': [
    {
      name: 'Ограда классическая',
      short_description: 'Традиционная ограда из гранита',
      full_description: 'Классическая ограда из натурального гранита. Прочная конструкция, долговечная и эстетически привлекательная. Защищает могилу и создает уютное пространство.',
      materials: 'Гранит, металл',
      production_time: '10-14 дней',
      price: 500,
      image: '/images/ogrady-1.jpg',
      is_new: false,
      is_popular: true,
    },
    {
      name: 'Ограда премиум',
      short_description: 'Роскошная ограда с декоративными элементами',
      full_description: 'Премиальная ограда с художественными элементами. Изготовлена из высококачественного гранита с ручной обработкой. Уникальный дизайн и безупречное качество.',
      materials: 'Гранит премиум, декоративные элементы',
      production_time: '14-21 день',
      price: 1200,
      discount: 10,
      image: '/images/ogrady-2.jpg',
      is_new: true,
      is_popular: true,
    },
    {
      name: 'Ограда минималистичная',
      short_description: 'Современная ограда в минималистичном стиле',
      full_description: 'Современная ограда в минималистичном стиле. Чистые линии, простота и элегантность. Идеально подходит для современных памятников.',
      materials: 'Гранит, металл',
      production_time: '10-14 дней',
      price: 600,
      image: '/images/ogrady-3.jpg',
      is_new: true,
      is_popular: false,
    },
  ],
  'Столы': [
    {
      name: 'Стол мемориальный',
      short_description: 'Гранитный стол для поминальных обрядов',
      full_description: 'Прочный гранитный стол для проведения поминальных обрядов. Устойчив к погодным условиям, легко моется. Комфортная высота и размеры.',
      materials: 'Гранит, металлические опоры',
      production_time: '14-21 день',
      price: 800,
      image: '/images/stoly-1.jpg',
      is_new: false,
      is_popular: true,
    },
    {
      name: 'Стол с лавкой',
      short_description: 'Комплект стол и лавка из гранита',
      full_description: 'Комплект из стола и лавки из натурального гранита. Идеально подходит для создания уютного места для поминовения. Гармоничный дизайн.',
      materials: 'Гранит, металл',
      production_time: '21-28 дней',
      price: 1500,
      discount: 12,
      image: '/images/stoly-2.jpg',
      is_new: true,
      is_popular: true,
    },
    {
      name: 'Стол круглый',
      short_description: 'Круглый гранитный стол',
      full_description: 'Элегантный круглый стол из гранита. Компактный размер, подходит для небольших участков. Качественное исполнение.',
      materials: 'Гранит',
      production_time: '14-21 день',
      price: 600,
      image: '/images/stoly-3.jpg',
      is_new: false,
      is_popular: false,
    },
  ],
  'Скамейки': [
    {
      name: 'Скамейка классическая',
      short_description: 'Традиционная скамейка из гранита',
      full_description: 'Классическая скамейка из натурального гранита. Прочная конструкция, комфортная для сидения. Идеально подходит для установки рядом с памятником.',
      materials: 'Гранит, металлические опоры',
      production_time: '14-21 день',
      price: 600,
      image: '/images/skameyki-1.jpg',
      is_new: false,
      is_popular: true,
    },
    {
      name: 'Скамейка с подлокотниками',
      short_description: 'Удобная скамейка с подлокотниками',
      full_description: 'Комфортная скамейка с подлокотниками из гранита. Эргономичный дизайн обеспечивает удобство при длительном сидении. Прочная и долговечная.',
      materials: 'Гранит, металл',
      production_time: '14-21 день',
      price: 800,
      discount: 10,
      image: '/images/skameyki-2.jpg',
      is_new: true,
      is_popular: true,
    },
    {
      name: 'Скамейка двойная',
      short_description: 'Широкая скамейка для двоих',
      full_description: 'Просторная скамейка для двоих из гранита. Идеально подходит для семейных посещений. Комфортная и стильная.',
      materials: 'Гранит, металл',
      production_time: '21-28 дней',
      price: 1200,
      image: '/images/skameyki-3.jpg',
      is_new: false,
      is_popular: false,
    },
  ],
};

async function main() {
  console.log('Добавление товаров...\n');

  const usedSlugs = new Set<string>();
  const usedSKUs = new Set<string>();

  for (const [categoryName, products] of Object.entries(productsByCategory)) {
    // Находим категорию по имени
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      console.log(`⚠ Категория "${categoryName}" не найдена, пропускаем...`);
      continue;
    }

    console.log(`📦 Добавление товаров в категорию "${categoryName}"...`);

    for (const productData of products) {
      try {
        // Проверяем, существует ли товар с таким именем
        const existing = await prisma.product.findFirst({
          where: { name: productData.name },
        });

        if (existing) {
          console.log(`  ⏭ Товар "${productData.name}" уже существует, пропускаем...`);
          continue;
        }

        // Генерируем уникальный slug
        let slug = generateSlug(productData.name);
        let slugCounter = 1;
        while (usedSlugs.has(slug)) {
          slug = `${generateSlug(productData.name)}-${slugCounter}`;
          slugCounter++;
        }
        // Проверяем в базе данных
        const existingSlug = await prisma.product.findFirst({
          where: { slug },
        });
        if (existingSlug) {
          slug = `${generateSlug(productData.name)}-${Date.now()}-${slugCounter}`;
          slugCounter++;
        }
        usedSlugs.add(slug);

        // Генерируем уникальный SKU
        let sku = generateSKU();
        while (usedSKUs.has(sku)) {
          sku = generateSKU();
        }
        // Проверяем в базе данных
        const existingSKU = await prisma.product.findFirst({
          where: { sku },
        });
        if (existingSKU) {
          sku = generateSKU(`GR${Date.now()}`);
        }
        usedSKUs.add(sku);

        // Рассчитываем цену со скидкой
        const discountedPrice = productData.discount
          ? Math.round(productData.price * (1 - productData.discount / 100) * 100) / 100
          : null;

        const created = await prisma.product.create({
          data: {
            name: productData.name,
            slug,
            sku,
            short_description: productData.short_description,
            full_description: productData.full_description,
            materials: productData.materials,
            production_time: productData.production_time,
            price: productData.price,
            discount: productData.discount || null,
            discounted_price: discountedPrice,
            image: productData.image,
            category_id: category.id,
            is_new: productData.is_new || false,
            is_popular: productData.is_popular || false,
            is_active: true,
          },
        });

        console.log(`  ✓ Добавлен товар: ${created.name} (ID: ${created.id}, SKU: ${created.sku})`);
      } catch (error) {
        console.error(`  ❌ Ошибка при добавлении товара "${productData.name}":`, error);
      }
    }

    console.log('');
  }

  console.log('✅ Готово!');
}

main()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
