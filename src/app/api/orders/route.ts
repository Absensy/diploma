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

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

function asNumber(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parsePersonalization(raw: unknown): OrderItemInput['personalization'] | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as RawPersonalization;
  const first = asString(p.first_name);
  const last = asString(p.last_name);
  if (!first || !last) {
    throw new ValidationError('Имя и фамилия в опроснике обязательны');
  }
  const symbol = typeof p.symbol === 'string' && (ALLOWED_SYMBOLS as readonly string[]).includes(p.symbol)
    ? (p.symbol as (typeof ALLOWED_SYMBOLS)[number])
    : 'NONE';

  return {
    first_name: first,
    last_name: last,
    patronymic: asString(p.patronymic),
    birth_date: asString(p.birth_date),
    death_date: asString(p.death_date),
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

  return {
    cemetery_name: asString(d.cemetery_name),
    cemetery_address: address,
    city: asString(d.city),
    region: asString(d.region),
    contact_phone: phone,
    preferred_date: asString(d.preferred_date),
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

  const preferred = typeof c.preferred_contact === 'string' && (ALLOWED_CONTACT_METHODS as readonly string[]).includes(c.preferred_contact)
    ? (c.preferred_contact as (typeof ALLOWED_CONTACT_METHODS)[number])
    : null;

  return {
    first_name: first,
    last_name: last,
    patronymic: asString(c.patronymic),
    phone,
    email: asString(c.email),
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
