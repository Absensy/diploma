export interface OurServiceItem {
  id: number;
  name: string;
  subtext: string;
  image: string;
}

/** Иконки с серым кругом из public/images (tools → pen → hammer) */
const SERVICE_ICONS = ['/images/tools.svg', '/images/pen.svg', '/images/hammer.svg'] as const;

/** Локальные иконки для карточек «Наши услуги» */
export const DEFAULT_OUR_SERVICES: OurServiceItem[] = [
  {
    id: 1,
    name: 'Памятники и надгробия',
    subtext:
      'Изготовление памятников, надгробий и мемориальных комплексов из гранита и мрамора',
    image: SERVICE_ICONS[0],
  },
  {
    id: 2,
    name: 'Венки и цветы',
    subtext: 'Красивые венки из искусственных и живых цветов для украшения могил',
    image: SERVICE_ICONS[1],
  },
  {
    id: 3,
    name: 'Светильники и освещение',
    subtext: 'Настенные и напольные светильники из гранита с LED подсветкой',
    image: SERVICE_ICONS[2],
  },
  {
    id: 4,
    name: 'Ограды и ограждения',
    subtext: 'Прочные ограды из гранита для благоустройства могильных участков',
    image: SERVICE_ICONS[0],
  },
  {
    id: 5,
    name: 'Столы и скамейки',
    subtext: 'Мемориальные столы и скамейки из гранита для комфортного поминовения',
    image: SERVICE_ICONS[1],
  },
  {
    id: 6,
    name: 'Гравировка и установка',
    subtext: 'Нанесение текста, изображений и профессиональная установка всех изделий',
    image: SERVICE_ICONS[2],
  },
];

const ALLOWED_SERVICE_IMAGES = new Set<string>(SERVICE_ICONS);

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
    const image =
      service.image && ALLOWED_SERVICE_IMAGES.has(service.image)
        ? service.image
        : fallback.image;

    return {
      ...fallback,
      ...service,
      id: service.id ?? fallback.id,
      image,
    };
  });

  return { ourServices };
}
