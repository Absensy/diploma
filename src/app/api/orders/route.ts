import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';
import {
  createOrderWithInventory,
  ContactInfoRequiredError,
  InsufficientStockError,
  PersonalizationRequiredError,
  ProductNotFoundOrInactiveError,
  ServiceNotFoundError,
  type OrderContactInput,
  type OrderDeliveryInput,
  type OrderItemInput,
  type OrderServiceInput,
} from '@/lib/services/order.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

async function getUserId(request: NextRequest): Promise<number | null> {
  try {
    const token = request.cookies.get('user-token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload.userId ? Number(payload.userId) : null;
  } catch {
    return null;
  }
}

// --- Валидация входящего payload ---

type RawItem = {
  product_id?: unknown;
  quantity?: unknown;
  personalization?: unknown;
};

type RawPersonalization = Record<string, unknown>;

const ALLOWED_SYMBOLS = ['NONE', 'ORTHODOX_CROSS', 'CATHOLIC_CROSS', 'CRESCENT', 'STAR_OF_DAVID', 'OTHER'] as const;
const ALLOWED_CONTACT_METHODS = ['PHONE', 'EMAIL', 'WHATSAPP', 'TELEGRAM', 'VIBER'] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;
const SERIES_RE = /^[A-ZА-Я]{2}$/;
const NUMBER_RE = /^\d{7}$/;
const PERSONAL_RE = /^[A-Z0-9]{14}$/;
const NAME_RE = /^[A-Za-zА-Яа-яЁёІіЎў'.\- ]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

function asNumber(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function requireMatch(value: string, re: RegExp, message: string): string {
  if (!re.test(value)) throw new ValidationError(message);
  return value;
}

function optionalMatch(value: string | null, re: RegExp, message: string): string | null {
  if (value && !re.test(value)) throw new ValidationError(message);
  return value;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function parsePersonalization(raw: unknown): OrderItemInput['personalization'] | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as RawPersonalization;
  const first = asString(p.first_name);
  const last = asString(p.last_name);
  if (!first || !last) {
    throw new ValidationError('Имя и фамилия в опроснике обязательны');
  }
  requireMatch(first, NAME_RE, 'Имя в опроснике содержит недопустимые символы');
  requireMatch(last, NAME_RE, 'Фамилия в опроснике содержит недопустимые символы');
  const patronymic = optionalMatch(
    asString(p.patronymic),
    NAME_RE,
    'Отчество в опроснике содержит недопустимые символы',
  );
  const symbol = typeof p.symbol === 'string' && (ALLOWED_SYMBOLS as readonly string[]).includes(p.symbol)
    ? (p.symbol as (typeof ALLOWED_SYMBOLS)[number])
    : 'NONE';

  const today = todayISO();
  const birthDate = optionalMatch(asString(p.birth_date), ISO_DATE_RE, 'Некорректная дата рождения');
  const deathDate = optionalMatch(asString(p.death_date), ISO_DATE_RE, 'Некорректная дата смерти');
  if (birthDate && birthDate > today) throw new ValidationError('Дата рождения не может быть в будущем');
  if (deathDate && deathDate > today) throw new ValidationError('Дата смерти не может быть в будущем');
  if (birthDate && deathDate && birthDate > deathDate) {
    throw new ValidationError('Дата смерти раньше даты рождения');
  }

  return {
    first_name: first,
    last_name: last,
    patronymic,
    birth_date: birthDate,
    death_date: deathDate,
    portrait_photo: asString(p.portrait_photo),
    epitaph: asString(p.epitaph),
    symbol,
    notes: asString(p.notes),
  };
}

function parseItems(raw: unknown): OrderItemInput[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new ValidationError('Заказ должен содержать хотя бы один товар');
  }
  return raw.map((rawItem, idx): OrderItemInput => {
    const item = rawItem as RawItem;
    const productId = asNumber(item.product_id);
    const quantity = asNumber(item.quantity);
    if (!productId || productId <= 0) {
      throw new ValidationError(`Позиция #${idx + 1}: не указан product_id`);
    }
    if (!quantity || quantity <= 0) {
      throw new ValidationError(`Позиция #${idx + 1}: количество должно быть > 0`);
    }
    return {
      product_id: productId,
      quantity,
      personalization: parsePersonalization(item.personalization),
    };
  });
}

function parseServices(raw: unknown): OrderServiceInput[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) {
    throw new ValidationError('services должен быть массивом');
  }
  return raw.map((r, idx): OrderServiceInput => {
    const item = r as { service_id?: unknown; quantity?: unknown };
    const serviceId = asNumber(item.service_id);
    const quantity = asNumber(item.quantity) ?? 1;
    if (!serviceId || serviceId <= 0) {
      throw new ValidationError(`Услуга #${idx + 1}: не указан service_id`);
    }
    return { service_id: serviceId, quantity };
  });
}

function parseDelivery(raw: unknown): OrderDeliveryInput | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;
  const address = asString(d.cemetery_address);
  const phone = asString(d.contact_phone);
  if (!address) throw new ValidationError('Адрес кладбища обязателен');
  if (!phone) throw new ValidationError('Контактный телефон для доставки обязателен');
  requireMatch(phone, PHONE_RE, 'Некорректный номер телефона для доставки');

  const preferredDate = optionalMatch(
    asString(d.preferred_date),
    ISO_DATE_RE,
    'Некорректная дата установки',
  );
  if (preferredDate && preferredDate < todayISO()) {
    throw new ValidationError('Дата установки не может быть в прошлом');
  }

  return {
    cemetery_name: asString(d.cemetery_name),
    cemetery_address: address,
    city: asString(d.city),
    region: asString(d.region),
    contact_phone: phone,
    preferred_date: preferredDate,
    comment: asString(d.comment),
  };
}

function parseContact(raw: unknown): OrderContactInput | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;
  const first = asString(c.first_name);
  const last = asString(c.last_name);
  const phone = asString(c.phone);
  if (!first || !last) throw new ValidationError('Имя и фамилия клиента обязательны');
  if (!phone) throw new ValidationError('Контактный телефон обязателен');
  requireMatch(first, NAME_RE, 'Имя клиента содержит недопустимые символы');
  requireMatch(last, NAME_RE, 'Фамилия клиента содержит недопустимые символы');
  requireMatch(phone, PHONE_RE, 'Некорректный номер телефона');

  const preferred = typeof c.preferred_contact === 'string' && (ALLOWED_CONTACT_METHODS as readonly string[]).includes(c.preferred_contact)
    ? (c.preferred_contact as (typeof ALLOWED_CONTACT_METHODS)[number])
    : null;

  const issuedAt = optionalMatch(asString(c.passport_issued_at), ISO_DATE_RE, 'Некорректная дата выдачи паспорта');
  if (issuedAt && issuedAt > todayISO()) {
    throw new ValidationError('Дата выдачи паспорта не может быть в будущем');
  }

  return {
    first_name: first,
    last_name: last,
    patronymic: optionalMatch(asString(c.patronymic), NAME_RE, 'Отчество клиента содержит недопустимые символы'),
    phone,
    email: optionalMatch(asString(c.email), EMAIL_RE, 'Некорректный адрес электронной почты'),
    address: asString(c.address),
    passport_series: optionalMatch(asString(c.passport_series), SERIES_RE, 'Серия паспорта — две буквы'),
    passport_number: optionalMatch(asString(c.passport_number), NUMBER_RE, 'Номер паспорта — 7 цифр'),
    passport_issued_by: asString(c.passport_issued_by),
    passport_issued_at: issuedAt,
    personal_number: optionalMatch(asString(c.personal_number), PERSONAL_RE, 'Личный номер — 14 символов'),
    preferred_contact: preferred,
    comment: asString(c.comment),
  };
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// --- Handler ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderItems = parseItems(body.order_items);
    const services = parseServices(body.services);
    const delivery = parseDelivery(body.delivery);
    const contact = parseContact(body.contact ?? body.customer_info);
    const paymentMethod = body.payment_method === 'ONLINE' ? 'ONLINE' : 'OFFLINE';

    const userId = await getUserId(request);

    const order = await createOrderWithInventory({
      userId,
      orderItems,
      services,
      delivery,
      contact,
      paymentMethod,
    });

    revalidatePath('/catalog');
    revalidatePath('/api/products');
    revalidatePath('/api/filters');

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          order_date: order.order_date,
          status: order.status,
          total_amount: Number(order.total_amount),
          payment_method: order.payment_method,
          items: order.order_items,
          additional_services: order.additional_services,
          delivery: order.delivery,
        },
        message: 'Заказ успешно создан. С вами свяжется менеджер для уточнения деталей.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof ContactInfoRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof InsufficientStockError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof ProductNotFoundOrInactiveError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof PersonalizationRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof ServiceNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        error: 'Ошибка при создании заказа',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
