import { Prisma } from '@prisma/client';

export type FullOrderType = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        first_name: true;
        last_name: true;
        email: true;
        phone: true;
      };
    };
    order_items: {
      include: {
        product: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
      };
    };
  };
}>;

// Исправленный хелпер: теперь он принимает null и возвращает "0,00 BYN" в случае ошибки
const formatBYN = (amount: number | Prisma.Decimal | null | undefined) => {
  const value = amount ? Number(amount) : 0;
  return new Intl.NumberFormat('ru-BY', {
    style: 'currency',
    currency: 'BYN',
    minimumFractionDigits: 2,
  }).format(value);
};

export async function sendOrderNotification(order: FullOrderType) {
  const {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY,
    NEXT_PUBLIC_APP_URL,
  } = process.env;

  // 1. Проверка конфигурации
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.error('[EMAIL_SERVICE_ERROR]: Missing environment variables');
    return;
  }

  // 2. ЗАЩИТА ОТ NULL: Проверяем, что пользователь существует (убирает ошибку 'order.user' is possibly null)
  if (!order.user) {
    console.error(`[EMAIL_SERVICE_ERROR]: Order #${order.id} has no user data`);
    return;
  }

  try {
    const ordersArray = order.order_items.map((item) => {
      const imageUrl = item.product?.image?.startsWith('http')
        ? item.product.image
        : `${NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${item.product?.image}`;

      return {
        name: item.product?.name || 'Товар',
        units: item.quantity,
        // Передаем цену (она может быть null в БД, поэтому formatBYN теперь это обрабатывает)
        price: formatBYN(item.price_at_purchase),
        image_url: imageUrl,
      };
    });

    const templateParams = {
      order_id: order.id.toString(),
      email: order.user.email, // Здесь ошибки больше не будет благодаря проверке выше
      orders: ordersArray,
      cost: {
        shipping: "0,00 BYN",
        tax: "0,00 BYN",
        // Передаем итоговую сумму
        total: formatBYN(order.total_amount),
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS Response: ${errorText}`);
    }

    console.log(`[EMAIL_SUCCESS]: BYN Notification for Order #${order.id} sent`);
  } catch (error) {
    console.error(`[EMAIL_SERVICE_EXCEPTION] Order #${order.id}:`, error);
  }
}