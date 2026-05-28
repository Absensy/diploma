export type PersonalizationSymbol =
  | 'NONE'
  | 'ORTHODOX_CROSS'
  | 'CATHOLIC_CROSS'
  | 'CRESCENT'
  | 'STAR_OF_DAVID'
  | 'OTHER';

export type ContactMethod = 'PHONE' | 'EMAIL' | 'WHATSAPP' | 'TELEGRAM' | 'VIBER';

export type ServiceUnit = 'PER_ITEM' | 'PER_ORDER' | 'PER_SQM' | 'PER_METER';

export type ServiceCategory =
  | 'DELIVERY'
  | 'INSTALLATION'
  | 'LANDSCAPING'
  | 'DEMOLITION'
  | 'ENGRAVING'
  | 'OTHER';

export const SYMBOL_LABELS: Record<PersonalizationSymbol, string> = {
  NONE: 'Без символа',
  ORTHODOX_CROSS: 'Православный крест',
  CATHOLIC_CROSS: 'Католический крест',
  CRESCENT: 'Полумесяц',
  STAR_OF_DAVID: 'Звезда Давида',
  OTHER: 'Другой (уточним отдельно)',
};

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  PHONE: 'Телефонный звонок',
  EMAIL: 'Email',
  WHATSAPP: 'WhatsApp',
  TELEGRAM: 'Telegram',
  VIBER: 'Viber',
};

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  DELIVERY: 'Доставка',
  INSTALLATION: 'Установка',
  LANDSCAPING: 'Благоустройство',
  DEMOLITION: 'Демонтаж',
  ENGRAVING: 'Дополнительная гравировка',
  OTHER: 'Прочее',
};

export const SERVICE_UNIT_LABELS: Record<ServiceUnit, string> = {
  PER_ITEM: 'за памятник',
  PER_ORDER: 'за заказ',
  PER_SQM: 'за м²',
  PER_METER: 'за п. м',
};
