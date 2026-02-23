import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Венки',
    price_from: 50,
    photo: '/images/venki.jpg',
    is_active: true,
  },
  {
    name: 'Светильники',
    price_from: 100,
    photo: '/images/svetilniki.jpg',
    is_active: true,
  },
  {
    name: 'Ограды',
    price_from: 200,
    photo: '/images/ogrady.jpg',
    is_active: true,
  },
  {
    name: 'Столы',
    price_from: 300,
    photo: '/images/stoly.jpg',
    is_active: true,
  },
  {
    name: 'Скамейки',
    price_from: 250,
    photo: '/images/skameyki.jpg',
    is_active: true,
  },
];

async function main() {
  console.log('Добавление категорий...');

  for (const category of categories) {
    try {
      // Проверяем, существует ли категория с таким именем
      const existing = await prisma.category.findFirst({
        where: { name: category.name },
      });

      if (existing) {
        console.log(`Категория "${category.name}" уже существует, пропускаем...`);
        continue;
      }

      const created = await prisma.category.create({
        data: category,
      });

      console.log(`✓ Добавлена категория: ${created.name} (ID: ${created.id})`);
    } catch (error) {
      console.error(`Ошибка при добавлении категории "${category.name}":`, error);
    }
  }

  console.log('Готово!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
