export interface OurServiceItem {
  id: number;
  name: string;
  subtext: string;
  image: string;
}

/** Локальные иконки из public/images — для карточек «Наши услуги» (64×64) */
export const DEFAULT_OUR_SERVICES: OurServiceItem[] = [
  {
    id: 1,
    name: 'Памятники и надгробия',
    subtext:
      'Изготовление памятников, надгробий и мемориальных комплексов из гранита и мрамора',
    image: '/images/tools.svg',
  },
  {
    id: 2,
    name: 'Венки и цветы',
    subtext: 'Красивые венки из искусственных и живых цветов для украшения могил',
    image: '/images/greenCheck.svg',
  },
  {
    id: 3,
    name: 'Светильники и освещение',
    subtext: 'Настенные и напольные светильники из гранита с LED подсветкой',
    image: '/images/clocks.svg',
  },
  {
    id: 4,
    name: 'Ограды и ограждения',
    subtext: 'Прочные ограды из гранита для благоустройства могильных участков',
    image: '/images/hammer.svg',
  },
  {
    id: 5,
    name: 'Столы и скамейки',
    subtext: 'Мемориальные столы и скамейки из гранита для комфортного поминовения',
    image: '/images/pen.svg',
  },
  {
    id: 6,
    name: 'Гравировка и установка',
    subtext: 'Нанесение текста, изображений и профессиональная установка всех изделий',
    image: '/images/ShowMore.svg',
  },
];

export function isLocalContentImage(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.startsWith('/images/') || url.startsWith('/uploads/');
}

export function normalizeOurServices(
  services: OurServiceItem[] | undefined,
): { ourServices: OurServiceItem[] } {
  if (!Array.isArray(services) || services.length === 0) {
    return { ourServices: DEFAULT_OUR_SERVICES };
  }

  const ourServices = services.map((service, index) => {
    const fallback = DEFAULT_OUR_SERVICES[index % DEFAULT_OUR_SERVICES.length];
    return {
      ...fallback,
      ...service,
      id: service.id ?? fallback.id,
      image: isLocalContentImage(service.image) ? service.image : fallback.image,
    };
  });

  return { ourServices };
}
