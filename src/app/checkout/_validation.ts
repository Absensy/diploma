import type { ContactData } from './_types';

export type ContactErrors = Partial<Record<keyof ContactData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;
const SERIES_RE = /^[A-ZА-Я]{2}$/;
const NUMBER_RE = /^\d{7}$/;
const PERSONAL_RE = /^[A-Z0-9]{14}$/;

/**
 * Единая проверка контактных данных. Используется и для блокировки кнопки
 * «Далее» (ошибок нет → шаг валиден), и для показа сообщений под полями.
 * Возвращает только заполненные ключи — пустой объект означает «всё верно».
 */
export function getContactErrors(c: ContactData): ContactErrors {
  const errors: ContactErrors = {};

  if (!c.last_name.trim()) errors.last_name = 'Укажите фамилию';
  if (!c.first_name.trim()) errors.first_name = 'Укажите имя';

  if (!c.phone.trim()) errors.phone = 'Укажите телефон для связи';
  else if (!PHONE_RE.test(c.phone.trim())) errors.phone = 'Некорректный номер телефона';

  if (c.email.trim() && !EMAIL_RE.test(c.email.trim()))
    errors.email = 'Некорректный адрес электронной почты';

  if (!c.address.trim()) errors.address = 'Укажите адрес проживания';

  if (!c.passport_series.trim()) errors.passport_series = 'Укажите серию паспорта';
  else if (!SERIES_RE.test(c.passport_series.trim()))
    errors.passport_series = 'Серия — две буквы, например KH';

  if (!c.passport_number.trim()) errors.passport_number = 'Укажите номер паспорта';
  else if (!NUMBER_RE.test(c.passport_number.trim()))
    errors.passport_number = 'Номер паспорта — 7 цифр';

  if (!c.passport_issued_by.trim()) errors.passport_issued_by = 'Укажите, кем выдан паспорт';

  if (!c.passport_issued_at.trim()) errors.passport_issued_at = 'Укажите дату выдачи';

  if (c.personal_number.trim() && !PERSONAL_RE.test(c.personal_number.trim()))
    errors.personal_number = 'Личный номер — 14 символов (буквы и цифры)';

  return errors;
}
