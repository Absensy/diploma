import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Контент на русском языке
const contentData = {
  about_company: {
    title: 'О нашей компании',
    description: 'Более 15 лет мы создаем памятники, надгробия, венки, светильники, ограды, столы и скамейки из гранита и мрамора. Наша компания предлагает полный комплекс услуг по благоустройству могильных участков - от изготовления памятников до установки и гравировки. Мы используем только качественные материалы и индивидуальный подход к каждому заказу.',
    image: '/images/ded.png',
    advantages: [
      'Качество материалов',
      'Индивидуальный подход',
      'Гарантия и надёжность'
    ],
    statistics: [
      { value: '15+', label: 'лет опыта' },
      { value: '2000+', label: 'изделий' },
      { value: '100%', label: 'гарантия' }
    ]
  },
  our_services: {
    ourServices: [
      {
        id: 1,
        name: 'Памятники и надгробия',
        subtext: 'Изготовление памятников, надгробий и мемориальных комплексов из гранита и мрамора',
        image: '/images/tools.svg'
      },
      {
        id: 2,
        name: 'Венки и цветы',
        subtext: 'Красивые венки из искусственных и живых цветов для украшения могил',
        image: '/images/pen.svg'
      },
      {
        id: 3,
        name: 'Светильники и освещение',
        subtext: 'Настенные и напольные светильники из гранита с LED подсветкой',
        image: '/images/hammer.svg'
      },
      {
        id: 4,
        name: 'Ограды и ограждения',
        subtext: 'Прочные ограды из гранита для благоустройства могильных участков',
        image: '/images/tools.svg'
      },
      {
        id: 5,
        name: 'Столы и скамейки',
        subtext: 'Мемориальные столы и скамейки из гранита для комфортного поминовения',
        image: '/images/pen.svg'
      },
      {
        id: 6,
        name: 'Гравировка и установка',
        subtext: 'Нанесение текста, изображений и профессиональная установка всех изделий',
        image: '/images/hammer.svg'
      }
    ]
  },
  footer: {
    slogan: 'Сохраняем память о ваших близких в граните на века',
    unp_number: '1234567890',
    copyright_text: '© 2024 Гранит памяти. Все права защищены.',
    company_full_name: 'ООО "Гранит Памяти"'
  }
};

async function main() {
  console.log('Обновление контента на русский язык...\n');

  try {
    // Обновление секции "О компании"
    console.log('📝 Обновление секции "О компании"...');
    const aboutCompany = await prisma.content.upsert({
      where: { section: 'about_company' },
      update: {
        data: contentData.about_company,
        updated_at: new Date()
      },
      create: {
        section: 'about_company',
        data: contentData.about_company
      }
    });
    console.log('✓ Секция "О компании" обновлена\n');

    // Обновление секции "Наши услуги"
    console.log('📝 Обновление секции "Наши услуги"...');
    const ourServices = await prisma.content.upsert({
      where: { section: 'our_services' },
      update: {
        data: contentData.our_services,
        updated_at: new Date()
      },
      create: {
        section: 'our_services',
        data: contentData.our_services
      }
    });
    console.log('✓ Секция "Наши услуги" обновлена\n');

    // Обновление секции "Футер"
    console.log('📝 Обновление секции "Футер"...');
    const footer = await prisma.content.upsert({
      where: { section: 'footer' },
      update: {
        data: contentData.footer,
        updated_at: new Date()
      },
      create: {
        section: 'footer',
        data: contentData.footer
      }
    });
    console.log('✓ Секция "Футер" обновлена\n');

    console.log('✅ Все секции контента успешно обновлены на русский язык!');
  } catch (error) {
    console.error('❌ Ошибка при обновлении контента:', error);
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
