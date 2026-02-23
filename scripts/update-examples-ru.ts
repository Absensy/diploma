import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Русские названия для примеров работ
const russianTitles = [
  'Памятник из черного гранита',
  'Мемориальный комплекс "Вечность"',
  'Надгробие из серого гранита',
  'Памятник с гравировкой',
  'Мемориал "Память"',
  'Памятник из красного гранита',
  'Надгробие "Классик"',
  'Мемориальный комплекс "Семейный"',
  'Памятник из белого мрамора',
  'Надгробие с декоративными элементами',
];

const russianDescriptions = [
  'Элегантный памятник из высококачественного черного гранита с ручной обработкой. Идеально подходит для увековечивания памяти близких.',
  'Величественный мемориальный комплекс, выполненный из натурального гранита. Включает памятник, ограду и декоративные элементы.',
  'Классическое надгробие из серого гранита с красивой текстурой. Прочное и долговечное решение для могильного участка.',
  'Памятник с художественной гравировкой и позолоченными надписями. Индивидуальный дизайн и высокое качество исполнения.',
  'Мемориал, созданный с особым вниманием к деталям. Сочетает традиционные элементы с современным дизайном.',
  'Выразительный памятник из красного гранита с уникальной текстурой. Придает могильному участку особую индивидуальность.',
  'Классическое надгробие в традиционном стиле. Выполнено из качественного гранита с соблюдением всех стандартов.',
  'Семейный мемориальный комплекс для нескольких захоронений. Включает общий памятник и элементы благоустройства.',
  'Изысканный памятник из белого мрамора премиум класса. Элегантный дизайн и безупречное качество исполнения.',
  'Надгробие с декоративными элементами и художественной обработкой. Уникальный дизайн для особых случаев.',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(): string {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString('ru-RU');
}

function getRandomDimensions(): string {
  const width = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
  const height = Math.floor(Math.random() * (150 - 80 + 1)) + 80;
  const depth = Math.floor(Math.random() * (40 - 15 + 1)) + 15;
  return `${width}x${height}x${depth}`;
}

async function main() {
  console.log('Обновление примеров работ на русский язык...\n');

  try {
    const examples = await prisma.examplesOurWork.findMany();

    console.log(`Найдено ${examples.length} примеров работ для обновления\n`);

    for (let i = 0; i < examples.length; i++) {
      const example = examples[i];
      try {
        const title = russianTitles[i % russianTitles.length];
        const description = russianDescriptions[i % russianDescriptions.length];
        const dimensions = getRandomDimensions();
        const date = getRandomDate();

        await prisma.examplesOurWork.update({
          where: { id: example.id },
          data: {
            title,
            description,
            dimensions,
            date,
          },
        });

        console.log(`✓ Обновлен пример работы: ${title} (ID: ${example.id})`);
      } catch (error) {
        console.error(`❌ Ошибка при обновлении примера работы ID ${example.id}:`, error);
      }
    }

    console.log('\n✅ Готово!');
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
