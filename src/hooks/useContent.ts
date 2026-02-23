import { useState, useEffect } from 'react';

interface AboutCompanyData {
  title: string;
  description: string;
  image: string;
  advantages: string[];
  statistics: Array<{
    value: string;
    label: string;
  }>;
}

interface Service {
  id: number;
  name: string;
  subtext: string;
  image: string;
}

interface OurServicesData {
  ourServices: Service[];
}

export function useAboutCompanyContent() {
  const [data, setData] = useState<AboutCompanyData>({
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/about-company');
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
      const contentData = await response.json();
      setData(contentData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке контента');
      // Оставляем дефолтные значения при ошибке
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

interface FooterData {
  slogan: string;
  unp_number: string;
  copyright_text: string;
  company_full_name: string;
}

export function useFooterContent() {
  const [data, setData] = useState<FooterData>({
    slogan: 'Сохраняем память о ваших близких в граните на века',
    unp_number: '1234567890',
    copyright_text: '© 2024 Гранит памяти. Все права защищены.',
    company_full_name: 'ООО "Гранит Памяти"'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/footer');
      
      if (!response.ok) {
        throw new Error('Failed to fetch footer content');
      }
      
      const footerData = await response.json();
      setData(footerData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке контента футера');
      // Оставляем дефолтные значения при ошибке
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

export function useOurServicesContent() {
  const [data, setData] = useState<OurServicesData>({
    ourServices: [
      {
        id: 1,
        name: 'Памятники и надгробия',
        subtext: 'Изготовление памятников, надгробий и мемориальных комплексов из гранита и мрамора',
        image: '/images/memorialMonument.jpg'
      },
      {
        id: 2,
        name: 'Венки и цветы',
        subtext: 'Красивые венки из искусственных и живых цветов для украшения могил',
        image: '/images/doubleMonument.jpg'
      },
      {
        id: 3,
        name: 'Светильники и освещение',
        subtext: 'Настенные и напольные светильники из гранита с LED подсветкой',
        image: '/images/GrneyMonument.jpg'
      },
      {
        id: 4,
        name: 'Ограды и ограждения',
        subtext: 'Прочные ограды из гранита для благоустройства могильных участков',
        image: '/images/memorialMonument.jpg'
      },
      {
        id: 5,
        name: 'Столы и скамейки',
        subtext: 'Мемориальные столы и скамейки из гранита для комфортного поминовения',
        image: '/images/doubleMonument.jpg'
      },
      {
        id: 6,
        name: 'Гравировка и установка',
        subtext: 'Нанесение текста, изображений и профессиональная установка всех изделий',
        image: '/images/GrneyMonument.jpg'
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/our-services');
      
      if (!response.ok) {
        throw new Error('Failed to fetch our services content');
      }
      
      const servicesData = await response.json();
      setData(servicesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке контента услуг');
      // Оставляем дефолтные значения при ошибке
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}