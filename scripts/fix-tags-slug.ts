import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Функция для транслитерации кириллицы в латиницу
function transliterate(text: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  };
  
  return text.split('').map(char => translitMap[char] || char).join('');
}

// Функция для генерации slug из названия
function generateSlug(name: string): string {
  // Сначала транслитерируем кириллицу
  let slug = transliterate(name);
  
  // Затем преобразуем в lowercase и заменяем пробелы и спецсимволы
  slug = slug
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return slug || 'tag'; // Если slug пустой, используем 'tag' как fallback
}

async function main() {
  console.log('Исправление slug для тегов...\n');

  try {
    // Получаем все теги
    const tags = await prisma.tag.findMany({
      orderBy: { id: 'asc' },
    });

    console.log(`Найдено ${tags.length} тегов\n`);

    const usedSlugs = new Set<string>();

    for (const tag of tags) {
      try {
        // Генерируем правильный slug из названия
        let slug = generateSlug(tag.name);
        let counter = 1;
        const originalSlug = slug;

        // Убеждаемся, что slug уникален
        while (usedSlugs.has(slug)) {
          slug = `${originalSlug}-${counter}`;
          counter++;
        }

        // Проверяем, существует ли уже тег с таким slug (кроме текущего)
        const existingTag = await prisma.tag.findFirst({
          where: {
            slug,
            id: { not: tag.id },
          },
        });

        if (existingTag) {
          slug = `${originalSlug}-${counter}`;
          counter++;
        }

        usedSlugs.add(slug);

        // Обновляем slug, если он отличается от текущего или если текущий slug отрицательный/неправильный
        const needsUpdate = tag.slug !== slug || tag.slug.startsWith('-') || !tag.slug || tag.slug === '';
        
        if (needsUpdate) {
          await prisma.tag.update({
            where: { id: tag.id },
            data: { slug },
          });
          console.log(`✓ Обновлен тег "${tag.name}": "${tag.slug}" → "${slug}"`);
        } else {
          console.log(`✓ Тег "${tag.name}" уже имеет правильный slug: "${slug}"`);
        }
      } catch (error: any) {
        console.error(`❌ Ошибка при обновлении тега "${tag.name}" (ID: ${tag.id}):`, error.message);
      }
    }

    console.log('\n✅ Готово! Все slug тегов исправлены.');
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
