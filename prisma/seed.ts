import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// Local image paths — only files that actually exist in public/uploads/product/
const productImages = [
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

const exampleImages = [
  '/images/doubleMonument.jpg',
  '/images/doubleMonuments.jpg',
  '/images/memorialMonument.jpg',
  '/images/GrneyMonument.jpg',
  '/uploads/product/product_1766404232698.jpg',
  '/uploads/product/product_1766404292137.jpg',
];

const categoryImagePools: Record<string, string[]> = {
  'Светильники': ['/images/lamp.png'],
  'Ограды': ['/images/fence.png'],
  'Столы': ['/images/table.png'],
  'Скамейки': ['/images/bench.png'],
};

function imagesForCategory(categoryName: string): string[] {
  return categoryImagePools[categoryName] ?? productImages;
}

const prisma = new PrismaClient();

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to generate SKU
function generateSKU(prefix: string = 'GR'): string {
  return `${prefix}-${faker.string.alphanumeric(6).toUpperCase()}`;
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productMaterial.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.relatedProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.material.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.examplesOurWork.deleteMany();
  console.log('✅ Database cleared\n');

  // 1. Create Contact Info
  console.log('📞 Creating contact info...');
  await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      address: 'пр. Янки Купалы 22а, цокольный этаж',
      phone: '+375 (29) 708-21-11',
      email: 'info@granite-memory.by',
      instagram: 'granit.grodno',
      working_hours: 'Пн-Пт: 9:00 - 18:00, Сб-Вс: 10:00 - 16:00',
    },
  });
  console.log('✅ Contact info created\n');

  // Контент «Наши услуги» — локальные SVG-иконки
  console.log('🛠️  Creating our services content...');
  await prisma.content.upsert({
    where: { section: 'our_services' },
    update: {},
    create: {
      section: 'our_services',
      data: {
        ourServices: [
          { id: 1, name: 'Памятники и надгробия', subtext: 'Изготовление памятников, надгробий и мемориальных комплексов из гранита и мрамора', image: '/images/tools.svg' },
          { id: 2, name: 'Венки и цветы', subtext: 'Красивые венки из искусственных и живых цветов для украшения могил', image: '/images/pen.svg' },
          { id: 3, name: 'Светильники и освещение', subtext: 'Настенные и напольные светильники из гранита с LED подсветкой', image: '/images/hammer.svg' },
          { id: 4, name: 'Ограды и ограждения', subtext: 'Прочные ограды из гранита для благоустройства могильных участков', image: '/images/tools.svg' },
          { id: 5, name: 'Столы и скамейки', subtext: 'Мемориальные столы и скамейки из гранита для комфортного поминовения', image: '/images/pen.svg' },
          { id: 6, name: 'Гравировка и установка', subtext: 'Нанесение текста, изображений и профессиональная установка всех изделий', image: '/images/hammer.svg' },
        ],
      },
    },
  });
  console.log('✅ Our services content created\n');

  // 2. Create Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Памятники одинарные',
        price_from: 1200.00,
        photo: '/uploads/category/category_1766404396936.jpg',
        discount: 10,
        discounted_price: 1080.00,
      },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Памятники двойные',
        price_from: 2200.00,
        photo: '/images/doubleMonument.jpg',
        discount: 15,
        discounted_price: 1870.00,
      },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Мемориальные комплексы',
        price_from: 4800.00,
        photo: '/images/memorialMonument.jpg',
      },
    }),
    prisma.category.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Гранитные плиты',
        price_from: 700.00,
        photo: '/uploads/category/category_1766404400663.jpg',
        discount: 5,
        discounted_price: 665.00,
      },
    }),
    prisma.category.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Надгробные плиты',
        price_from: 1000.00,
        photo: '/uploads/category/category_1766404414959.jpg',
      },
    }),
    prisma.category.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Венки',
        price_from: 50.00,
        photo: '/uploads/category/category_1766404423318.jpg',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 7 },
      update: {},
      create: {
        name: 'Светильники',
        price_from: 100.00,
        photo: '/images/lamp.png',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 8 },
      update: {},
      create: {
        name: 'Ограды',
        price_from: 200.00,
        photo: '/images/fence.png',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 9 },
      update: {},
      create: {
        name: 'Столы',
        price_from: 300.00,
        photo: '/images/table.png',
        is_active: true,
      },
    }),
    prisma.category.upsert({
      where: { id: 10 },
      update: {},
      create: {
        name: 'Скамейки',
        price_from: 250.00,
        photo: '/images/bench.png',
        is_active: true,
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories\n`);

  // 3. Create Users (1 Admin + 5 Customers)
  console.log('👥 Creating users...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@granite-memory.by' },
    update: {},
    create: {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@granite-memory.by',
      password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqO', // In production, use proper hashing
      phone: '+375 (29) 123-45-67',
    },
  });

  // Русские имена и фамилии
  const russianFirstNames = [
    'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Илья',
    'Кирилл', 'Михаил', 'Никита', 'Матвей', 'Роман', 'Егор', 'Арсений', 'Иван',
    'Анна', 'Мария', 'Елена', 'Наталья', 'Ольга', 'Татьяна', 'Ирина', 'Екатерина',
    'Светлана', 'Юлия', 'Анастасия', 'Дарья', 'Марина', 'Виктория', 'Полина', 'София'
  ];
  const russianLastNames = [
    'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов', 'Лебедев',
    'Козлов', 'Новиков', 'Морозов', 'Волков', 'Соловьев', 'Васильев', 'Зайцев', 'Павлов',
    'Семенов', 'Голубев', 'Виноградов', 'Богданов', 'Воробьев', 'Федоров', 'Михайлов', 'Белов'
  ];

  const customers = await Promise.all(
    Array.from({ length: 5 }).map(() => {
      const firstName = faker.helpers.arrayElement(russianFirstNames);
      const lastName = faker.helpers.arrayElement(russianLastNames);
      return prisma.user.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email: faker.internet.email().toLowerCase(),
          password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqO', // In production, use proper hashing
          phone: `+375 (${faker.number.int({ min: 29, max: 44 })}) ${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 10, max: 99 })}-${faker.number.int({ min: 10, max: 99 })}`,
        },
      });
    })
  );
  const allUsers = [admin, ...customers];
  console.log(`✅ Created ${allUsers.length} users (1 admin, ${customers.length} customers)\n`);

  // 4. Create Materials
  console.log('🔨 Creating materials...');
  const materialNames = [
    'Черный гранит',
    'Серый гранит',
    'Красный гранит',
    'Белый мрамор',
    'Бронза',
    'Золотая фольга',
    'Стекло',
  ];

  // Описания материалов на русском языке
  const materialDescriptions: Record<string, string> = {
    'Черный гранит': 'Высококачественный черный гранит премиум класса. Отличается глубоким черным цветом и однородной структурой. Идеально подходит для изготовления памятников и надгробий.',
    'Серый гранит': 'Прочный серый гранит с красивой текстурой. Устойчив к погодным условиям и долговечен. Широко используется для памятников и мемориальных комплексов.',
    'Красный гранит': 'Элегантный красный гранит с благородным оттенком. Придает памятникам особую выразительность и индивидуальность.',
    'Белый мрамор': 'Классический белый мрамор высочайшего качества. Идеален для создания элегантных и изысканных памятников.',
    'Бронза': 'Качественная бронза для декоративных элементов и надписей. Обеспечивает долговечность и красивый внешний вид.',
    'Золотая фольга': 'Премиальная золотая фольга для нанесения надписей и изображений. Создает эффектный и долговечный результат.',
    'Стекло': 'Прочное закаленное стекло для светильников и декоративных элементов. Устойчиво к перепадам температур.',
  };

  const materials = await Promise.all(
    materialNames.map((name) =>
      prisma.material.upsert({
        where: { name },
        update: {},
        create: {
          name,
          description: materialDescriptions[name] || '',
        },
      })
    )
  );
  console.log(`✅ Created ${materials.length} materials\n`);

  // 5. Create Tags
  console.log('🏷️  Creating tags...');
  const tagNames = [
    'Новинка',
    'Популярное',
    'Премиум',
    'Эксклюзив',
    'Классика',
    'Современный стиль',
    'Религиозный',
    'Минимализм',
    'Элегантность',
    'Традиционный',
    'Арт-деко',
    'Семейный',
  ];

  // Create tags sequentially to avoid conflicts
  const tags = [];
  const usedTagSlugs = new Set<string>();
  
  for (const name of tagNames) {
    let slug = generateSlug(name);
    let counter = 1;
    
    // Ensure unique slug
    while (usedTagSlugs.has(slug)) {
      slug = `${generateSlug(name)}-${counter}`;
      counter++;
    }
    usedTagSlugs.add(slug);
    
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug,
      },
    });
    
    tags.push(tag);
  }
  console.log(`✅ Created ${tags.length} tags\n`);

  // 6. Create Products (25 products)
  console.log('📦 Creating products...');
  const productCatalog: { category: string; names: string[] }[] = [
    {
      category: 'Памятники одинарные',
      names: ['Памятник "Классик"', 'Памятник "Элегант"', 'Памятник "Свет"', 'Памятник "Достоинство"'],
    },
    {
      category: 'Памятники двойные',
      names: ['Памятник "Семейный"', 'Памятник "Дуэт"', 'Памятник "Гармония"', 'Памятник "Союз"'],
    },
    {
      category: 'Мемориальные комплексы',
      names: ['Мемориал "Вечность"', 'Мемориал "Память"', 'Мемориал "Величие"', 'Мемориал "Честь"'],
    },
    {
      category: 'Гранитные плиты',
      names: ['Плита "Простота"', 'Плита "Минимал"', 'Плита "Элегия"', 'Плита "Скромность"'],
    },
    {
      category: 'Надгробные плиты',
      names: ['Надгробие "Традиция"', 'Надгробие "Вера"', 'Надгробие "Надежда"', 'Надгробие "Мудрость"'],
    },
    {
      category: 'Венки',
      names: ['Венок "Скорбь"', 'Венок "Память"', 'Венок "Лилия"', 'Венок "Роза"'],
    },
    {
      category: 'Светильники',
      names: ['Светильник "Лампада"', 'Светильник "Огонёк"', 'Светильник "Вечный свет"', 'Светильник "Свеча"'],
    },
    {
      category: 'Ограды',
      names: ['Ограда "Классика"', 'Ограда "Ажур"', 'Ограда "Гранит"', 'Ограда "Строгая"'],
    },
    {
      category: 'Столы',
      names: ['Стол "Поминальный"', 'Стол "Гранитный"', 'Стол "Семейный"', 'Стол "Классик"'],
    },
    {
      category: 'Скамейки',
      names: ['Скамейка "Покой"', 'Скамейка "Гранитная"', 'Скамейка "Уют"', 'Скамейка "Классик"'],
    },
  ];

  const categoryByName = new Map(categories.map((c: any) => [c.name, c]));
  const productPlan = productCatalog.flatMap(({ category: catName, names }) => {
    const cat = categoryByName.get(catName);
    return cat ? names.map((name) => ({ name, category: cat })) : [];
  });

  // Create products sequentially to ensure unique slugs and SKUs
  const products: any[] = [];
  const usedSlugs = new Set<string>();
  const usedSKUs = new Set<string>();

  for (let index = 0; index < productPlan.length; index++) {
    const { name, category } = productPlan[index];
    
    // Generate unique slug
    let slug = generateSlug(name);
    let slugCounter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${generateSlug(name)}-${slugCounter}`;
      slugCounter++;
    }
    usedSlugs.add(slug);
    
    // Generate unique SKU
    let sku = generateSKU();
    while (usedSKUs.has(sku)) {
      sku = generateSKU();
    }
    usedSKUs.add(sku);
      const basePrice = faker.number.float({ min: 800, max: 6500, fractionDigits: 2 });
      const hasDiscount = faker.datatype.boolean({ probability: 0.4 });
      const discount = hasDiscount ? faker.number.int({ min: 5, max: 25 }) : null;
      const discountedPrice = discount
        ? Math.round(basePrice * (1 - discount / 100) * 100) / 100
        : null;

      // Select 1-3 random materials
      const selectedMaterials = faker.helpers.arrayElements(materials, {
        min: 1,
        max: 3,
      });
      const materialsString = selectedMaterials.map((m: any) => m.name).join(', ');

      // Select 2-4 random tags
      const selectedTags = faker.helpers.arrayElements(tags, {
        min: 2,
        max: 4,
      });

      // Генерируем русские описания в зависимости от категории
      const categoryName = category.name.toLowerCase();
      let shortDesc = '';
      let fullDesc = '';
      let metaDesc = '';
      let metaKeywords = '';

      if (categoryName.includes('памятник')) {
        shortDesc = `${name}. Изготовление памятников из натурального гранита высочайшего качества. Долговечные, устойчивые к погодным условиям.`;
        fullDesc = `Памятник ${name} из натурального гранита. Профессиональное изготовление с индивидуальным дизайном и гравировкой. Устойчив к любым погодным условиям, сохраняет внешний вид десятилетиями. Широкий выбор форм, размеров и вариантов оформления.`;
        metaDesc = `Изготовление памятника ${name} из натурального гранита. Профессиональное изготовление, установка и обслуживание. г. Гродно.`;
        metaKeywords = 'памятники, гранит, мемориалы, надгробия, ритуальные услуги, установка памятников, гравировка, Гродно';
      } else if (categoryName.includes('венк')) {
        shortDesc = `${name}. Искусственные венки из качественных материалов для украшения могил. Устойчивы к погодным условиям.`;
        fullDesc = `Венок ${name} из искусственных цветов для памятников. Разнообразие форм, размеров и цветовых решений. Прочные материалы с защитой от выцветания, подходят для круглогодичного использования.`;
        metaDesc = `Венки для памятников. Качественные искусственные венки с доставкой и установкой. г. Гродно.`;
        metaKeywords = 'венки, искусственные венки, венки на могилу, ритуальные венки, украшение могил, Гродно';
      } else if (categoryName.includes('светил') || categoryName.includes('лампа')) {
        shortDesc = `${name}. Светильники для памятников из прочных материалов. Автоматическое включение в темное время суток.`;
        fullDesc = `Светильник ${name} для мемориалов. Энергосберегающие светодиодные светильники. Устойчивы к влаге и перепадам температур. Долгий срок службы, экономичное энергопотребление.`;
        metaDesc = `Светильники для памятников. Современные светодиодные светильники с автоматическим включением. г. Гродно.`;
        metaKeywords = 'светильники, светильники для памятников, мемориальные светильники, освещение могил, Гродно';
      } else {
        shortDesc = `${name}. Качественные ритуальные товары из гранита и других материалов. Профессиональное изготовление и установка.`;
        fullDesc = `Товар ${name} для благоустройства могил. Широкий ассортимент ритуальных товаров от производителя. Индивидуальный подход, гарантия качества, доставка и установка.`;
        metaDesc = `Ритуальные товары ${name}. Качественные товары для благоустройства могил с доставкой и установкой. г. Гродно.`;
        metaKeywords = 'ритуальные товары, товары для могил, благоустройство могил, ритуальные услуги, Гродно';
      }

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          short_description: shortDesc,
          full_description: fullDesc,
          materials: materialsString,
          production_time: `${faker.number.int({ min: 3, max: 30 })} дней`,
          price: basePrice,
          discount,
          discounted_price: discountedPrice,
          image: faker.helpers.arrayElement(imagesForCategory(category.name)),
          category_id: category.id,
          meta_title: `${name} - Гранитная память`,
          meta_description: metaDesc,
          meta_keywords: metaKeywords,
          weight: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
          dimensions: `${faker.number.int({ min: 80, max: 150 })}x${faker.number.int({
            min: 40,
            max: 80,
          })}x${faker.number.int({ min: 10, max: 30 })}`,
          stock_quantity: faker.number.int({ min: 0, max: 10 }),
          sku: sku,
          is_new: faker.datatype.boolean({ probability: 0.3 }),
          is_popular: faker.datatype.boolean({ probability: 0.3 }),
          is_active: true,
          // Create product-material relationships
          product_materials: {
            create: selectedMaterials.map((material: any) => ({
              material_id: material.id,
            })),
          },
          // Create product-tag relationships
          tags: {
            create: selectedTags.map((tag: any) => ({
              tag_id: tag.id,
            })),
          },
        },
      });

      // Create product images (1-3 images per product)
      const imageCount = faker.number.int({ min: 1, max: 3 });
      await Promise.all(
        Array.from({ length: imageCount }).map((_, imgIndex) =>
          prisma.productImage.create({
            data: {
              product_id: product.id,
              url: faker.helpers.arrayElement(imagesForCategory(category.name)),
              alt: `${name} - изображение ${imgIndex + 1}`,
              order: imgIndex,
              is_primary: imgIndex === 0,
            },
          })
        )
      );

      // Create product attributes (2-4 attributes per product)
      const attributeNames = ['Высота', 'Ширина', 'Толщина', 'Цвет', 'Обработка'];
      const attributeCount = faker.number.int({ min: 2, max: 4 });
      const selectedAttributes = faker.helpers.arrayElements(attributeNames, attributeCount);
      await Promise.all(
        selectedAttributes.map((attrName: string, attrIndex: number) =>
          prisma.productAttribute.create({
            data: {
              product_id: product.id,
              name: attrName,
              value: faker.lorem.word(),
              order: attrIndex,
            },
          })
        )
      );

      products.push(product);
    }
  console.log(`✅ Created ${products.length} products\n`);

  // Create related products (some products have related products)
  console.log('🔗 Creating product relationships...');
  for (let i = 0; i < products.length; i++) {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      const relatedProduct = faker.helpers.arrayElement(
        products.filter((p: any) => p.id !== products[i].id)
      );
      try {
        await prisma.relatedProduct.create({
          data: {
            product_id: products[i].id,
            related_product_id: relatedProduct.id,
          },
        });
      } catch (e) {
        // Ignore duplicate errors
      }
    }
  }
  console.log('✅ Product relationships created\n');

  // 7. Create Orders (15 orders)
  console.log('🛒 Creating orders...');
  const orderStatuses: Array<'NEW' | 'PAID' | 'IN_PRODUCTION' | 'IN_DELIVERY' | 'COMPLETED' | 'CANCELLED'> = [
    'NEW',
    'PAID',
    'IN_PRODUCTION',
    'IN_DELIVERY',
    'COMPLETED',
    'CANCELLED',
  ];
  const paymentMethods: Array<'ONLINE' | 'OFFLINE'> = ['ONLINE', 'OFFLINE'];

  const orders = await Promise.all(
    Array.from({ length: 15 }).map(async () => {
      const user = faker.helpers.arrayElement(customers);
      const status = faker.helpers.arrayElement(orderStatuses);
      const paymentMethod = faker.helpers.arrayElement(paymentMethods);
      const orderDate = faker.date.recent({ days: 90 });

      // Select 1-4 random products for this order
      const selectedProducts = faker.helpers.arrayElements(products, {
        min: 1,
        max: 4,
      });

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = selectedProducts.map((product: any) => {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const price = product.discounted_price
          ? Number(product.discounted_price)
          : Number(product.price);
        const itemTotal = price * quantity;
        totalAmount += itemTotal;

        return {
          product_id: product.id,
          quantity,
          price_at_purchase: price,
        };
      });

      const order = await prisma.order.create({
        data: {
          user_id: user.id,
          order_date: orderDate,
          status,
          payment_method: paymentMethod,
          total_amount: Math.round(totalAmount * 100) / 100,
          order_items: {
            create: orderItems,
          },
        },
      });

      return order;
    })
  );
  console.log(`✅ Created ${orders.length} orders\n`);

  // 8. Create Examples of Work
  console.log('🖼️  Creating examples of work...');
  const russianTitles = [
    'Памятник из черного гранита',
    'Мемориальный комплекс "Вечность"',
    'Надгробие из серого гранита',
    'Памятник с гравировкой',
    'Мемориал "Память"',
    'Памятник из красного гранита',
  ];
  const russianDescriptions = [
    'Элегантный памятник из высококачественного черного гранита с ручной обработкой. Идеально подходит для увековечивания памяти близких.',
    'Величественный мемориальный комплекс, выполненный из натурального гранита. Включает памятник, ограду и декоративные элементы.',
    'Классическое надгробие из серого гранита с красивой текстурой. Прочное и долговечное решение для могильного участка.',
    'Памятник с художественной гравировкой и позолоченными надписями. Индивидуальный дизайн и высокое качество исполнения.',
    'Мемориал, созданный с особым вниманием к деталям. Сочетает традиционные элементы с современным дизайном.',
    'Выразительный памятник из красного гранита с уникальной текстурой. Придает могильному участку особую индивидуальность.',
  ];
  const examples = await Promise.all(
    Array.from({ length: 6 }).map((_, index) =>
      prisma.examplesOurWork.create({
        data: {
          title: russianTitles[index] || `Пример работы ${index + 1}`,
          image: faker.helpers.arrayElement(exampleImages),
          dimensions: `${faker.number.int({ min: 100, max: 200 })}x${faker.number.int({
            min: 50,
            max: 100,
          })}x${faker.number.int({ min: 15, max: 40 })}`,
          date: faker.date.past({ years: 2 }).toLocaleDateString('ru-RU'),
          description: russianDescriptions[index] || 'Качественное изделие из гранита.',
          is_active: true,
        },
      })
    )
  );
  console.log(`✅ Created ${examples.length} examples of work\n`);

  // Summary
  console.log('📊 Seeding Summary:');
  console.log(`   ✅ Users: ${allUsers.length} (1 admin, ${customers.length} customers)`);
  console.log(`   ✅ Categories: ${categories.length}`);
  console.log(`   ✅ Materials: ${materials.length}`);
  console.log(`   ✅ Tags: ${tags.length}`);
  console.log(`   ✅ Products: ${products.length}`);
  console.log(`   ✅ Orders: ${orders.length}`);
  console.log(`   ✅ Examples of Work: ${examples.length}`);
  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
