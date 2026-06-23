import type { ContactData, DeliveryData, PersonalizationData } from './_types';

export type ContactErrors = Partial<Record<keyof ContactData, string>>;
export type DeliveryErrors = Partial<Record<keyof DeliveryData, string>>;
export type PersonalizationErrors = Partial<Record<keyof PersonalizationData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;
const SERIES_RE = /^[A-ZА-Я]{2}$/;
const NUMBER_RE = /^\d{7}$/;
const PERSONAL_RE = /^[A-Z0-9]{14}$/;
const NAME_RE = /^[A-Za-zА-Яа-яЁёІіЎў'.\- ]+$/;

const MAX = {
  name: 50,
  address: 200,
  shortText: 120,
  longText: 500,
} as const;

const todayISO = (): string => new Date().toISOString().slice(0, 10);

/**
 * Единая проверка контактных данных. Используется и для блокировки кнопки
 * «Далее» (ошибок нет → шаг валиден), и для показа сообщений под полями.
 * Возвращает только заполненные ключи — пустой объект означает «всё верно».
 */
export function getContactErrors(c: ContactData): ContactErrors {
  const errors: ContactErrors = {};

  if (!c.last_name.trim()) errors.last_name = 'Укажите фамилию';
  else if (!NAME_RE.test(c.last_name.trim()))
    errors.last_name = 'Фамилия — только буквы, дефис и пробел';
  else if (c.last_name.trim().length > MAX.name)
    errors.last_name = `Не длиннее ${MAX.name} символов`;

  if (!c.first_name.trim()) errors.first_name = 'Укажите имя';
  else if (!NAME_RE.test(c.first_name.trim()))
    errors.first_name = 'Имя — только буквы, дефис и пробел';
  else if (c.first_name.trim().length > MAX.name)
    errors.first_name = `Не длиннее ${MAX.name} символов`;

  if (c.patronymic.trim() && !NAME_RE.test(c.patronymic.trim()))
    errors.patronymic = 'Отчество — только буквы, дефис и пробел';

  if (!c.phone.trim()) errors.phone = 'Укажите телефон для связи';
  else if (!PHONE_RE.test(c.phone.trim())) errors.phone = 'Некорректный номер телефона';

  if (c.email.trim() && !EMAIL_RE.test(c.email.trim()))
    errors.email = 'Некорректный адрес электронной почты';

  if (!c.address.trim()) errors.address = 'Укажите адрес проживания';
  else if (c.address.trim().length > MAX.address)
    errors.address = `Адрес не длиннее ${MAX.address} символов`;

  if (!c.passport_series.trim()) errors.passport_series = 'Укажите серию паспорта';
  else if (!SERIES_RE.test(c.passport_series.trim()))
    errors.passport_series = 'Серия — две буквы, например KH';

  if (!c.passport_number.trim()) errors.passport_number = 'Укажите номер паспорта';
  else if (!NUMBER_RE.test(c.passport_number.trim()))
    errors.passport_number = 'Номер паспорта — 7 цифр';

  if (!c.passport_issued_by.trim()) errors.passport_issued_by = 'Укажите, кем выдан паспорт';
  else if (c.passport_issued_by.trim().length > MAX.address)
    errors.passport_issued_by = `Не длиннее ${MAX.address} символов`;

  if (!c.passport_issued_at.trim()) errors.passport_issued_at = 'Укажите дату выдачи';
  else if (c.passport_issued_at > todayISO())
    errors.passport_issued_at = 'Дата выдачи не может быть в будущем';

  if (c.personal_number.trim() && !PERSONAL_RE.test(c.personal_number.trim()))
    errors.personal_number = 'Личный номер — 14 символов (буквы и цифры)';

  return errors;
}

export function getDeliveryErrors(d: DeliveryData): DeliveryErrors {
  const errors: DeliveryErrors = {};

  if (!d.cemetery_address.trim()) errors.cemetery_address = 'Укажите адрес кладбища';
  else if (d.cemetery_address.trim().length > MAX.address)
    errors.cemetery_address = `Адрес не длиннее ${MAX.address} символов`;

  if (!d.contact_phone.trim()) errors.contact_phone = 'Укажите телефон для координации';
  else if (!PHONE_RE.test(d.contact_phone.trim()))
    errors.contact_phone = 'Некорректный номер телефона';

  if (d.cemetery_name.trim().length > MAX.shortText)
    errors.cemetery_name = `Не длиннее ${MAX.shortText} символов`;

  if (d.city.trim().length > MAX.shortText) errors.city = `Не длиннее ${MAX.shortText} символов`;

  if (d.region.trim().length > MAX.shortText)
    errors.region = `Не длиннее ${MAX.shortText} символов`;

  if (d.preferred_date.trim() && d.preferred_date < todayISO())
    errors.preferred_date = 'Дата установки не может быть в прошлом';

  if (d.comment.trim().length > MAX.longText)
    errors.comment = `Комментарий не длиннее ${MAX.longText} символов`;

  return errors;
}

export function getPersonalizationErrors(p: PersonalizationData): PersonalizationErrors {
  const errors: PersonalizationErrors = {};
  const today = todayISO();

  if (!p.last_name.trim()) errors.last_name = 'Укажите фамилию';
  else if (!NAME_RE.test(p.last_name.trim()))
    errors.last_name = 'Фамилия — только буквы, дефис и пробел';
  else if (p.last_name.trim().length > MAX.name)
    errors.last_name = `Не длиннее ${MAX.name} символов`;

  if (!p.first_name.trim()) errors.first_name = 'Укажите имя';
  else if (!NAME_RE.test(p.first_name.trim()))
    errors.first_name = 'Имя — только буквы, дефис и пробел';
  else if (p.first_name.trim().length > MAX.name)
    errors.first_name = `Не длиннее ${MAX.name} символов`;

  if (p.patronymic.trim() && !NAME_RE.test(p.patronymic.trim()))
    errors.patronymic = 'Отчество — только буквы, дефис и пробел';

  if (p.birth_date.trim() && p.birth_date > today)
    errors.birth_date = 'Дата рождения не может быть в будущем';

  if (p.death_date.trim() && p.death_date > today)
    errors.death_date = 'Дата смерти не может быть в будущем';

  if (p.birth_date.trim() && p.death_date.trim() && p.birth_date > p.death_date)
    errors.death_date = 'Дата смерти раньше даты рождения';

  if (p.epitaph.trim().length > MAX.longText)
    errors.epitaph = `Эпитафия не длиннее ${MAX.longText} символов`;

  if (p.notes.trim().length > MAX.longText)
    errors.notes = `Примечания не длиннее ${MAX.longText} символов`;

  return errors;
}
