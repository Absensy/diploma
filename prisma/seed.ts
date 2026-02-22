import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// Local image paths for products and examples
const productImages = [
  '/images/singleMonument.jpg',
  '/images/doubleMonument.jpg',
  '/images/memorialMonument.jpg',
  '/images/graniteSlab.jpg',
  '/images/gravestone.jpg',
  '/images/GrneyMonument.jpg',
];

const exampleImages = [
  '/images/memorialMonument.jpg',
  '/images/singleMonument.jpg',
  '/images/doubleMonument.jpg',
  '/images/graniteSlab.jpg',
  '/images/gravestone.jpg',
  '/images/GrneyMonument.jpg',
];

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

  // 2. Create Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Памятники одинарные',
        price_from: 1200.00,
        photo: '/images/singleMonument.jpg',
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
        photo: '/images/graniteSlab.jpg',
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
        photo: '/images/gravestone.jpg',
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

  const customers = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email().toLowerCase(),
          password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqO', // In production, use proper hashing
          phone: `+375 (${faker.number.int({ min: 29, max: 44 })}) ${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 10, max: 99 })}-${faker.number.int({ min: 10, max: 99 })}`,
        },
      })
    )
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

  const materials = await Promise.all(
    materialNames.map((name) =>
      prisma.material.upsert({
        where: { name },
        update: {},
        create: {
          name,
          description: faker.lorem.sentence(),
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
  const productNames = [
    'Памятник "Классик"',
    'Памятник "Семейный"',
    'Мемориал "Вечность"',
    'Плита "Простота"',
    'Надгробие "Традиция"',
    'Памятник "Элегант"',
    'Памятник "Дуэт"',
    'Мемориал "Память"',
    'Плита "Минимал"',
    'Надгробие "Вера"',
    'Памятник "Премиум"',
    'Памятник "Гармония"',
    'Мемориал "Величие"',
    'Памятник "Свет"',
    'Памятник "Память"',
    'Плита "Элегия"',
    'Надгробие "Надежда"',
    'Памятник "Достоинство"',
    'Мемориал "Честь"',
    'Памятник "Благородство"',
    'Плита "Скромность"',
    'Надгробие "Мудрость"',
    'Памятник "Великолепие"',
    'Мемориал "Героизм"',
    'Памятник "Бессмертие"',
  ];

  // Create products sequentially to ensure unique slugs and SKUs
  const products: any[] = [];
  const usedSlugs = new Set<string>();
  const usedSKUs = new Set<string>();
  
  for (let index = 0; index < productNames.length; index++) {
    const name = productNames[index];
    const category = categories[index % categories.length];
    
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

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          short_description: faker.lorem.sentence({ min: 10, max: 20 }),
          full_description: faker.lorem.paragraphs({ min: 2, max: 4 }),
          materials: materialsString,
          production_time: `${faker.number.int({ min: 3, max: 30 })} дней`,
          price: basePrice,
          discount,
          discounted_price: discountedPrice,
          image: faker.helpers.arrayElement(productImages),
          category_id: category.id,
          meta_title: `${name} - Гранитная память`,
          meta_description: faker.lorem.sentence(),
          meta_keywords: faker.lorem.words(5).split(' ').join(', '),
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
              url: faker.helpers.arrayElement(productImages),
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
  const orderStatuses: Array<'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'OFFLINE'> = [
    'PENDING',
    'PAID',
    'SHIPPED',
    'COMPLETED',
    'OFFLINE',
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
  const examples = await Promise.all(
    Array.from({ length: 6 }).map(() =>
      prisma.examplesOurWork.create({
        data: {
          title: faker.lorem.words({ min: 3, max: 6 }),
          image: faker.helpers.arrayElement(exampleImages),
          dimensions: `${faker.number.int({ min: 100, max: 200 })}x${faker.number.int({
            min: 50,
            max: 100,
          })}x${faker.number.int({ min: 15, max: 40 })}`,
          date: faker.date.past({ years: 2 }).toLocaleDateString('ru-RU'),
          description: faker.lorem.paragraph(),
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
