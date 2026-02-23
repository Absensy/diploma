import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Русские имена и фамилии
const russianFirstNames = [
  'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Илья',
  'Кирилл', 'Михаил', 'Никита', 'Матвей', 'Роман', 'Егор', 'Арсений', 'Иван',
  'Денис', 'Евгений', 'Данил', 'Тимур', 'Владислав', 'Игорь', 'Владимир', 'Павел',
  'Руслан', 'Марк', 'Лев', 'Андрей', 'Константин', 'Степан', 'Николай', 'Артур',
  'Анна', 'Мария', 'Елена', 'Наталья', 'Ольга', 'Татьяна', 'Ирина', 'Екатерина',
  'Светлана', 'Юлия', 'Анастасия', 'Дарья', 'Марина', 'Анна', 'Елена', 'Виктория',
  'Полина', 'София', 'Александра', 'Валентина', 'Галина', 'Людмила', 'Надежда', 'Валентина'
];

const russianLastNames = [
  'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов', 'Лебедев',
  'Козлов', 'Новиков', 'Морозов', 'Петров', 'Волков', 'Соловьев', 'Васильев', 'Зайцев',
  'Павлов', 'Семенов', 'Голубев', 'Виноградов', 'Богданов', 'Воробьев', 'Федоров', 'Михайлов',
  'Белов', 'Тарасов', 'Белов', 'Комаров', 'Орлов', 'Киселев', 'Макаров', 'Андреев',
  'Ковалев', 'Ильин', 'Гусев', 'Титов', 'Кузьмин', 'Кудрявцев', 'Баранов', 'Куликов',
  'Алексеев', 'Степанов', 'Яковлев', 'Сорокин', 'Сергеев', 'Романов', 'Захаров', 'Борисов'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  console.log('Обновление пользователей на русские имена...\n');

  try {
    // Получаем всех пользователей кроме админа
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: 'admin@granite-memory.by'
        }
      }
    });

    console.log(`Найдено ${users.length} пользователей для обновления\n`);

    for (const user of users) {
      try {
        const firstName = getRandomElement(russianFirstNames);
        const lastName = getRandomElement(russianLastNames);
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        });

        console.log(`✓ Обновлен пользователь: ${firstName} ${lastName} (ID: ${user.id})`);
      } catch (error) {
        console.error(`❌ Ошибка при обновлении пользователя ID ${user.id}:`, error);
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
