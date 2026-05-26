// @ts-ignore - pdfmake не имеет полных типов
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore - pdfmake не имеет полных типов
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ORDER_STATUS_META, type OrderStatus } from '@/lib/orderStatus';

// Инициализация шрифтов pdfmake (поддержка кириллицы через Roboto)
if (typeof window !== 'undefined' && pdfMake && pdfFonts) {
  (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;
  (pdfMake as any).fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf',
    },
  };
}

export interface ReceiptOrderItem {
  id: number;
  quantity: number;
  price_at_purchase: number;
  product: {
    id: number;
    name: string;
  } | null;
}

type DateLike = string | Date | null | undefined;

export interface ReceiptOrder {
  id: number;
  order_date: string | Date;
  status: OrderStatus | string;
  total_amount: number | null;
  payment_method: 'ONLINE' | 'OFFLINE' | string;
  paid_at?: DateLike;
  in_production_at?: DateLike;
  in_delivery_at?: DateLike;
  completed_at?: DateLike;
  cancelled_at?: DateLike;
  user: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string | null;
  } | null;
  order_items: ReceiptOrderItem[];
}

export interface ReceiptCompany {
  name?: string;
  address: string;
  phone: string;
  email: string;
  working_hours?: string | null;
  instagram?: string | null;
}

const COMPANY_NAME_DEFAULT = 'ООО «Гранит памяти»';
const COMPANY_TAGLINE = 'Гранитная мастерская';
const COMPANY_LOGO_URL = '/images/LogoGranitPrimary1.svg';
const LOGO_RENDER_PX = 256;
const BRAND_COLOR = '#222222';
const ACCENT_COLOR = '#7b1fa2';

/**
 * Загружает логотип компании и приводит его к PNG data URI.
 * Работает и для растровых, и для обёрнутых в SVG изображений.
 * Кеширует результат на время жизни вкладки.
 */
let cachedLogoDataUrl: string | null = null;
async function loadLogoAsDataUrl(url: string): Promise<string | null> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  if (typeof window === 'undefined') return null;
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const loaded: Promise<void> = new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load logo: ${url}`));
    });
    img.src = url;
    await loaded;

    const naturalSize = Math.max(img.naturalWidth || LOGO_RENDER_PX, img.naturalHeight || LOGO_RENDER_PX);
    const scale = LOGO_RENDER_PX / naturalSize;
    const w = Math.max(1, Math.round((img.naturalWidth || LOGO_RENDER_PX) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || LOGO_RENDER_PX) * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    cachedLogoDataUrl = canvas.toDataURL('image/png');
    return cachedLogoDataUrl;
  } catch (err) {
    console.warn('[receiptGenerator] Logo load failed, fallback to text-only header', err);
    return null;
  }
}

function formatMoney(amount: number | null | undefined): string {
  const value = typeof amount === 'number' ? amount : 0;
  return new Intl.NumberFormat('ru-BY', {
    style: 'currency',
    currency: 'BYN',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | Date | null | undefined, withTime = true): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

const paymentLabel: Record<string, string> = {
  ONLINE: 'Онлайн',
  OFFLINE: 'Офлайн / при получении',
};

function buildItemsTable(items: ReceiptOrderItem[]): unknown {
  const headerRow = [
    { text: '№', style: 'tableHeader', alignment: 'center' },
    { text: 'Наименование', style: 'tableHeader' },
    { text: 'Кол-во', style: 'tableHeader', alignment: 'center' },
    { text: 'Цена за шт.', style: 'tableHeader', alignment: 'right' },
    { text: 'Сумма', style: 'tableHeader', alignment: 'right' },
  ];

  const rows = items.map((item, index) => {
    const lineTotal = Number(item.price_at_purchase) * item.quantity;
    return [
      { text: String(index + 1), alignment: 'center' },
      { text: item.product?.name ?? 'Товар удалён', noWrap: false },
      { text: String(item.quantity), alignment: 'center' },
      { text: formatMoney(Number(item.price_at_purchase)), alignment: 'right' },
      { text: formatMoney(lineTotal), alignment: 'right', bold: true },
    ];
  });

  return {
    table: {
      headerRows: 1,
      widths: [24, '*', 50, 80, 90],
      body: [headerRow, ...rows],
    },
    layout: {
      fillColor: (rowIndex: number) => {
        if (rowIndex === 0) return BRAND_COLOR;
        return rowIndex % 2 === 0 ? '#f7f7f9' : null;
      },
      hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
      vLineWidth: () => 0,
      hLineColor: (i: number) => (i === 1 ? BRAND_COLOR : '#e0e0e0'),
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 7,
      paddingBottom: () => 7,
    },
  };
}

function buildTimeline(order: ReceiptOrder): unknown[] {
  const events: Array<{ label: string; date: string }> = [];
  events.push({ label: 'Заказ создан', date: formatDate(order.order_date) });
  if (order.paid_at) events.push({ label: 'Оплачен', date: formatDate(order.paid_at) });
  if (order.in_production_at) events.push({ label: 'В производстве', date: formatDate(order.in_production_at) });
  if (order.in_delivery_at) events.push({ label: 'В доставке', date: formatDate(order.in_delivery_at) });
  if (order.completed_at) events.push({ label: 'Выполнен', date: formatDate(order.completed_at) });
  if (order.cancelled_at) events.push({ label: 'Отменён', date: formatDate(order.cancelled_at) });

  if (events.length === 0) return [];

  return [
    { text: 'История заказа', style: 'sectionTitle', margin: [0, 14, 0, 6] as [number, number, number, number] },
    {
      ul: events.map((e) => ({
        text: [
          { text: `${e.label}: `, bold: true },
          { text: e.date, color: '#555' },
        ],
      })),
    },
  ];
}

export interface GenerateReceiptOptions {
  order: ReceiptOrder;
  company: ReceiptCompany;
  /** Если true — сразу триггерит скачивание; если false — возвращает Blob */
  download?: boolean;
}

export async function generateReceiptPDF({ order, company, download = true }: GenerateReceiptOptions): Promise<Blob | void> {
  const companyName = company.name?.trim() || COMPANY_NAME_DEFAULT;
  const logoDataUrl = await loadLogoAsDataUrl(COMPANY_LOGO_URL);
  const subtotal =
    typeof order.total_amount === 'number'
      ? order.total_amount
      : order.order_items.reduce((sum, item) => sum + Number(item.price_at_purchase) * item.quantity, 0);

  const customerName = order.user
    ? `${order.user.first_name ?? ''} ${order.user.last_name ?? ''}`.trim() || 'Гость'
    : 'Гость';

  const statusMeta = ORDER_STATUS_META[order.status as OrderStatus];
  const statusLabel = statusMeta?.label ?? String(order.status);
  const statusColor = statusMeta?.hex ?? BRAND_COLOR;

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 60],
    info: {
      title: `Чек #${order.id} — ${companyName}`,
      author: companyName,
      subject: 'Чек по заказу',
    },
    content: [
      // Шапка: лого + название слева, реквизиты чека справа
      {
        columns: [
          // Левая колонка: лого + название + контакты
          {
            width: '*',
            columns: [
              logoDataUrl
                ? { image: logoDataUrl, width: 64, height: 64, margin: [0, 0, 12, 0] }
                : { text: '', width: 0 },
              [
                { text: companyName, style: 'brand' },
                { text: COMPANY_TAGLINE, style: 'brandSub' },
                { text: company.address, style: 'companyMeta', margin: [0, 8, 0, 0] },
                { text: `Тел.: ${company.phone}`, style: 'companyMeta' },
                { text: `Email: ${company.email}`, style: 'companyMeta' },
                ...(company.working_hours ? [{ text: company.working_hours, style: 'companyMeta' }] : []),
              ],
            ],
            columnGap: 0,
          },
          // Правая колонка: ЧЕК № …
          {
            width: 'auto',
            stack: [
              { text: 'ЧЕК', style: 'receiptTitle', alignment: 'right' },
              { text: `№ ${order.id}`, style: 'receiptNumber', alignment: 'right' },
              { text: `от ${formatDate(order.order_date)}`, style: 'receiptDate', alignment: 'right' },
              {
                text: statusLabel.toUpperCase(),
                alignment: 'right',
                color: 'white',
                background: statusColor,
                fontSize: 9,
                bold: true,
                margin: [0, 10, 0, 0],
              },
            ],
          },
        ],
      },

      // Разделитель
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: BRAND_COLOR }],
        margin: [0, 16, 0, 16],
      },

      // Блок «Покупатель»
      {
        text: 'Покупатель',
        style: 'sectionTitle',
        margin: [0, 0, 0, 6],
      },
      {
        columns: [
          [
            { text: 'ФИО:', style: 'fieldLabel' },
            { text: customerName, style: 'fieldValue' },
          ],
          [
            { text: 'Email:', style: 'fieldLabel' },
            { text: order.user?.email ?? '—', style: 'fieldValue' },
          ],
          [
            { text: 'Телефон:', style: 'fieldLabel' },
            { text: order.user?.phone ?? '—', style: 'fieldValue' },
          ],
        ],
        columnGap: 16,
      },

      // Товары
      { text: 'Состав заказа', style: 'sectionTitle', margin: [0, 18, 0, 8] },
      buildItemsTable(order.order_items),

      // Итоги
      {
        columns: [
          { text: '', width: '*' },
          {
            width: 240,
            margin: [0, 12, 0, 0],
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Подытог', style: 'totalsLabel' },
                  { text: formatMoney(subtotal), style: 'totalsValue', alignment: 'right' },
                ],
                [
                  { text: 'К оплате', style: 'grandTotalLabel' },
                  { text: formatMoney(subtotal), style: 'grandTotalValue', alignment: 'right' },
                ],
              ],
            },
            layout: {
              hLineWidth: (i: number) => (i === 1 ? 1 : 0),
              vLineWidth: () => 0,
              hLineColor: () => '#e0e0e0',
              paddingTop: () => 4,
              paddingBottom: () => 4,
              paddingLeft: () => 4,
              paddingRight: () => 4,
            },
          },
        ],
      },

      // Способ оплаты + статус
      {
        margin: [0, 16, 0, 0],
        columns: [
          [
            { text: 'Способ оплаты', style: 'fieldLabel' },
            { text: paymentLabel[order.payment_method as string] ?? order.payment_method, style: 'fieldValue' },
          ],
          [
            { text: 'Статус заказа', style: 'fieldLabel' },
            { text: statusLabel, style: 'fieldValue', color: statusColor, bold: true },
          ],
        ],
        columnGap: 16,
      },

      // История переходов
      ...buildTimeline(order),

      // Подпись благодарности
      {
        text: 'Благодарим за выбор нашей мастерской.',
        style: 'thanks',
        margin: [0, 30, 0, 0],
      },
    ],
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        {
          text: companyName,
          fontSize: 8,
          color: '#888',
          margin: [40, 20, 0, 0],
        },
        {
          text: `Страница ${currentPage} из ${pageCount}`,
          fontSize: 8,
          color: '#888',
          alignment: 'right',
          margin: [0, 20, 40, 0],
        },
      ],
    }),
    styles: {
      brand: { fontSize: 20, bold: true, color: BRAND_COLOR },
      brandSub: { fontSize: 10, color: '#777' },
      companyMeta: { fontSize: 9, color: '#555', margin: [0, 1, 0, 1] },
      receiptTitle: { fontSize: 26, bold: true, color: ACCENT_COLOR, characterSpacing: 4 },
      receiptNumber: { fontSize: 14, bold: true, color: BRAND_COLOR, margin: [0, 2, 0, 0] },
      receiptDate: { fontSize: 9, color: '#777', margin: [0, 2, 0, 0] },
      sectionTitle: { fontSize: 11, bold: true, color: BRAND_COLOR, characterSpacing: 1 },
      fieldLabel: { fontSize: 8, color: '#888', margin: [0, 0, 0, 2] },
      fieldValue: { fontSize: 10, color: '#222', margin: [0, 0, 0, 8] },
      tableHeader: { color: 'white', bold: true, fontSize: 10 },
      totalsLabel: { fontSize: 10, color: '#555' },
      totalsValue: { fontSize: 10, color: '#222' },
      grandTotalLabel: { fontSize: 12, bold: true, color: BRAND_COLOR },
      grandTotalValue: { fontSize: 14, bold: true, color: BRAND_COLOR },
      thanks: { fontSize: 10, italics: true, color: '#666', alignment: 'center' },
    },
    defaultStyle: { font: 'Roboto', fontSize: 10, color: '#222' },
  };

  const pdf = (pdfMake as any).createPdf(docDefinition);
  const fileName = `чек_заказ_${order.id}.pdf`;

  if (download) {
    pdf.download(fileName);
    return;
  }

  return new Promise<Blob>((resolve) => {
    pdf.getBlob((blob: Blob) => resolve(blob));
  });
}
