// @ts-ignore - pdfmake не имеет полных типов
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore - pdfmake не имеет полных типов
import pdfFonts from 'pdfmake/build/vfs_fonts';

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

export interface ContractOrderItem {
  id: number;
  quantity: number;
  price_at_purchase: number;
  product: {
    id: number;
    name: string;
  } | null;
  personalization?: {
    last_name?: string | null;
    first_name?: string | null;
    patronymic?: string | null;
    birth_date?: string | Date | null;
    death_date?: string | Date | null;
  } | null;
}

export interface ContractServiceItem {
  id: number;
  quantity: number;
  price_at_purchase: number;
  service?: {
    id?: number;
    name?: string | null;
  } | null;
}

export interface ContractDelivery {
  cemetery_name?: string | null;
  cemetery_address?: string | null;
  city?: string | null;
  region?: string | null;
  preferred_date?: string | Date | null;
}

export interface ContractCustomer {
  first_name?: string | null;
  last_name?: string | null;
  patronymic?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  passport_series?: string | null;
  passport_number?: string | null;
  passport_issued_by?: string | null;
  passport_issued_at?: string | Date | null;
  personal_number?: string | null;
}

export interface ContractOrder {
  id: number;
  order_number?: string | null;
  order_date: string | Date;
  total_amount: number | null;
  payment_method: 'ONLINE' | 'OFFLINE' | string;
  customer: ContractCustomer;
  order_items: ContractOrderItem[];
  additional_services?: ContractServiceItem[];
  delivery?: ContractDelivery | null;
}

export interface ContractCompany {
  company_name?: string | null;
  legal_form?: string | null;
  director_name?: string | null;
  director_basis?: string | null;
  unp?: string | null;
  legal_address?: string | null;
  address: string;
  phone: string;
  email: string;
  bank_name?: string | null;
  bank_account?: string | null;
  bik?: string | null;
  working_hours?: string | null;
  instagram?: string | null;
}

const COMPANY_NAME_FALLBACK = 'ООО «Гранит памяти»';
const COMPANY_LOGO_URL = '/images/LogoGranitPrimary1.svg';
const LOGO_RENDER_PX = 256;
const BRAND_COLOR = '#222222';
const ACCENT_COLOR = '#7b1fa2';
const CITY = 'г. Гродно';
const ADVANCE_PERCENT = 30;
const PENALTY_PERCENT_PER_DAY = 0.5;
const CANCELLATION_FEE_PERCENT = 5;
const WARRANTY_INSTALL_YEARS = 3;
const WARRANTY_PRODUCT_YEARS = 10;
const STORAGE_LIMIT_YEARS = 1;
const DEFAULT_PRODUCTION_DAYS = 45;

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
    console.warn('[contractGenerator] Logo load failed, fallback to text-only header', err);
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

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateLong(value: string | Date | null | undefined): string {
  if (!value) return '«___» __________ ____ г.';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '«___» __________ ____ г.';
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return `«${String(date.getDate()).padStart(2, '0')}» ${months[date.getMonth()]} ${date.getFullYear()} г.`;
}

function fullName(parts: { last_name?: string | null; first_name?: string | null; patronymic?: string | null }): string {
  return [parts.last_name, parts.first_name, parts.patronymic]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
    .join(' ') || '____________________';
}

function formatCustomerName(c: ContractCustomer): string {
  return fullName(c);
}

function formatPassport(c: ContractCustomer): string {
  const series = (c.passport_series ?? '').trim();
  const number = (c.passport_number ?? '').trim();
  return [series, number].filter(Boolean).join(' ') || '__________ __________';
}

function formatIssuedBy(c: ContractCustomer): string {
  const issuer = (c.passport_issued_by ?? '').trim();
  const issuedAt = c.passport_issued_at ? formatDate(c.passport_issued_at) : null;
  if (!issuer && !issuedAt) return '_______________________________';
  if (issuer && issuedAt) return `${issuer}, ${issuedAt}`;
  return issuer || issuedAt || '';
}

function buildCommemorationText(items: ContractOrderItem[]): string {
  const names = items
    .map((i) => {
      const p = i.personalization;
      if (!p) return null;
      const name = fullName({ last_name: p.last_name, first_name: p.first_name, patronymic: p.patronymic });
      const birth = p.birth_date ? formatDate(p.birth_date) : null;
      const death = p.death_date ? formatDate(p.death_date) : null;
      const dates = [birth, death].filter(Boolean).join(' — ');
      return dates ? `${name} (${dates})` : name;
    })
    .filter(Boolean) as string[];
  return names.length ? `памяти ${names.join(', ')}` : '_______________________________';
}

function calcProductionDeadline(orderDate: Date): Date {
  const result = new Date(orderDate);
  result.setDate(result.getDate() + DEFAULT_PRODUCTION_DAYS);
  return result;
}

function buildItemsTable(order: ContractOrder): unknown {
  const headerRow = [
    { text: '№', style: 'tableHeader', alignment: 'center' },
    { text: 'Наименование', style: 'tableHeader' },
    { text: 'Кол-во', style: 'tableHeader', alignment: 'center' },
    { text: 'Цена', style: 'tableHeader', alignment: 'right' },
    { text: 'Сумма', style: 'tableHeader', alignment: 'right' },
  ];

  const rows: unknown[][] = [];
  let n = 0;

  for (const item of order.order_items) {
    n += 1;
    const lineTotal = Number(item.price_at_purchase) * item.quantity;
    rows.push([
      { text: String(n), alignment: 'center' },
      { text: item.product?.name ?? 'Товар удалён' },
      { text: String(item.quantity), alignment: 'center' },
      { text: formatMoney(Number(item.price_at_purchase)), alignment: 'right' },
      { text: formatMoney(lineTotal), alignment: 'right', bold: true },
    ]);
  }

  for (const svc of order.additional_services ?? []) {
    n += 1;
    const qty = Number(svc.quantity) || 1;
    const lineTotal = Number(svc.price_at_purchase) * qty;
    rows.push([
      { text: String(n), alignment: 'center' },
      { text: `Услуга: ${svc.service?.name ?? '—'}`, italics: true },
      { text: String(qty), alignment: 'center' },
      { text: formatMoney(Number(svc.price_at_purchase)), alignment: 'right' },
      { text: formatMoney(lineTotal), alignment: 'right', bold: true },
    ]);
  }

  return {
    table: {
      headerRows: 1,
      widths: [22, '*', 40, 70, 80],
      body: [headerRow, ...rows],
    },
    layout: {
      fillColor: (rowIndex: number) => {
        if (rowIndex === 0) return BRAND_COLOR;
        return rowIndex % 2 === 0 ? '#f7f7f9' : null;
      },
      hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
      vLineWidth: () => 0.5,
      hLineColor: (i: number) => (i === 1 ? BRAND_COLOR : '#e0e0e0'),
      vLineColor: () => '#e0e0e0',
      paddingLeft: () => 6,
      paddingRight: () => 6,
      paddingTop: () => 5,
      paddingBottom: () => 5,
    },
  };
}

function clause(num: string, body: unknown): unknown {
  return {
    columns: [
      { width: 32, text: num, bold: true, style: 'clauseNumber' },
      { width: '*', text: body, style: 'clauseBody' },
    ],
    columnGap: 0,
    margin: [0, 0, 0, 6] as [number, number, number, number],
  };
}

function section(title: string): unknown {
  return {
    text: title,
    style: 'sectionTitle',
    margin: [0, 14, 0, 8] as [number, number, number, number],
  };
}

export interface GenerateContractOptions {
  order: ContractOrder;
  company: ContractCompany;
  /** Если true — сразу триггерит скачивание; если false — возвращает Blob */
  download?: boolean;
}

export async function generateContractPDF(
  { order, company, download = true }: GenerateContractOptions
): Promise<Blob | void> {
  const companyDisplayName = (company.company_name?.trim() || COMPANY_NAME_FALLBACK);
  const directorName = company.director_name?.trim() || '____________________';
  const directorBasis = company.director_basis?.trim() || 'Устава';
  const logoDataUrl = await loadLogoAsDataUrl(COMPANY_LOGO_URL);

  const orderDate = order.order_date instanceof Date ? order.order_date : new Date(order.order_date);
  const productionDeadline = calcProductionDeadline(orderDate);

  const subtotal =
    typeof order.total_amount === 'number'
      ? order.total_amount
      : order.order_items.reduce((s, i) => s + Number(i.price_at_purchase) * i.quantity, 0) +
        (order.additional_services ?? []).reduce(
          (s, x) => s + Number(x.price_at_purchase) * Number(x.quantity || 1),
          0
        );

  const advanceAmount = Math.round(((subtotal * ADVANCE_PERCENT) / 100) * 100) / 100;
  const orderRef = order.order_number || `№ ${order.id}`;

  const commemoration = buildCommemorationText(order.order_items);
  const cemeteryLine = order.delivery
    ? [order.delivery.cemetery_name, order.delivery.cemetery_address].filter(Boolean).join(', ') || '—'
    : null;

  const customerName = formatCustomerName(order.customer);
  const customerAddress = order.customer.address?.trim() || '_______________________________';
  const customerPhone = order.customer.phone?.trim() || '_______________________________';
  const customerEmail = order.customer.email?.trim() || '—';
  const passportLine = formatPassport(order.customer);
  const issuedBy = formatIssuedBy(order.customer);

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 60],
    info: {
      title: `Договор ${orderRef} — ${companyDisplayName}`,
      author: companyDisplayName,
      subject: 'Договор изготовления и установки памятника',
    },
    content: [
      // Шапка
      {
        columns: [
          {
            width: '*',
            columns: [
              logoDataUrl
                ? { image: logoDataUrl, width: 56, height: 56, margin: [0, 0, 12, 0] }
                : { text: '', width: 0 },
              [
                { text: companyDisplayName, style: 'brand' },
                { text: company.address, style: 'companyMeta', margin: [0, 6, 0, 0] },
                { text: `Тел.: ${company.phone}  •  ${company.email}`, style: 'companyMeta' },
              ],
            ],
            columnGap: 0,
          },
          {
            width: 'auto',
            stack: [
              { text: 'ДОГОВОР', style: 'docTitle', alignment: 'right' },
              { text: orderRef, style: 'docNumber', alignment: 'right' },
              { text: `от ${formatDate(order.order_date)}`, style: 'docDate', alignment: 'right' },
            ],
          },
        ],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: BRAND_COLOR }],
        margin: [0, 10, 0, 14],
      },

      // Заголовок документа
      {
        text: 'ДОГОВОР ИЗГОТОВЛЕНИЯ И УСТАНОВКИ ПАМЯТНИКА',
        alignment: 'center',
        bold: true,
        fontSize: 13,
      },
      { text: `Заказ: ${orderRef}`, alignment: 'center', bold: true, fontSize: 12, margin: [0, 2, 0, 10] },

      {
        columns: [
          { text: CITY, alignment: 'left' },
          { text: formatDateLong(order.order_date), alignment: 'right' },
        ],
        margin: [0, 0, 0, 12],
      },

      // Преамбула
      {
        text: [
          { text: customerName, bold: true },
          ', проживающий(ая) по адресу: ',
          { text: customerAddress, italics: true },
          ', паспорт ',
          { text: passportLine, italics: true },
          ', выдан ',
          { text: issuedBy, italics: true },
          order.customer.personal_number ? `, личный номер ${order.customer.personal_number}` : '',
          ', именуемый(ая) в дальнейшем «Заказчик», с одной стороны, и ',
          { text: companyDisplayName, bold: true },
          ' в лице ',
          company.director_name ? 'директора ' : '',
          { text: directorName, italics: true },
          `, действующего на основании ${directorBasis}, именуемое в дальнейшем «Исполнитель», с другой стороны, заключили настоящий договор о нижеследующем:`,
        ],
        alignment: 'justify',
        margin: [0, 0, 0, 12],
      },

      // 1. Предмет договора
      section('1. ПРЕДМЕТ ДОГОВОРА'),
      clause('1.1', [
        'Исполнитель обязуется изготовить памятник, а Заказчик — принять и оплатить результат работ (далее — «изделие») в соответствии с заказом-нарядом ',
        { text: orderRef, bold: true },
        ' по увековечению ',
        { text: commemoration, italics: true },
        '.',
      ]),
      clause('1.2', 'Работы выполняются из материала Исполнителя.'),
      clause('1.3', 'Описание характеристик изделия, его комплектация и индивидуальное оформление (надписи, изображения, символика) содержатся в заказ-наряде, оформляемом одновременно с подписанием настоящего договора и являющемся его неотъемлемой частью.'),
      clause('1.4', 'В случае оказания услуг по установке изделия на захоронение, а также по демонтажу существующих памятников или иных надмогильных конструкций, стороны фиксируют объём таких работ в заказ-наряде.'),

      // 2. Цена и порядок расчётов
      section('2. ЦЕНА ДОГОВОРА И ПОРЯДОК РАСЧЁТОВ'),
      clause('2.1', [
        'Общая цена договора составляет ',
        { text: formatMoney(subtotal), bold: true },
        ' (включая стоимость изготовления изделия и заказанных дополнительных услуг). Состав работ и цены приведены в таблице ниже.',
      ]),
      buildItemsTable(order),
      {
        columns: [
          { text: '', width: '*' },
          {
            width: 220,
            margin: [0, 8, 0, 0],
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Итого к оплате', bold: true, color: BRAND_COLOR },
                  { text: formatMoney(subtotal), alignment: 'right', bold: true, color: BRAND_COLOR },
                ],
                [
                  { text: `Аванс (${ADVANCE_PERCENT}%)`, color: '#555' },
                  { text: formatMoney(advanceAmount), alignment: 'right' },
                ],
              ],
            },
            layout: {
              hLineWidth: (i: number) => (i === 1 ? 0.5 : 0),
              vLineWidth: () => 0,
              hLineColor: () => '#e0e0e0',
              paddingTop: () => 3,
              paddingBottom: () => 3,
              paddingLeft: () => 4,
              paddingRight: () => 4,
            },
          },
        ],
        margin: [0, 0, 0, 8],
      },
      clause('2.2', [
        `В день подписания настоящего договора Заказчик уплачивает Исполнителю аванс в размере не менее ${ADVANCE_PERCENT}% от общей цены договора, что составляет `,
        { text: formatMoney(advanceAmount), bold: true },
        '. Оставшаяся часть уплачивается Заказчиком не позднее 3 (трёх) календарных дней после уведомления о готовности изделия.',
      ]),
      clause('2.3', [
        'Срок изготовления и (при заказе установки) установки изделия — до ',
        { text: formatDate(productionDeadline), bold: true },
        ', при условии своевременного оформления заказ-наряда и внесения аванса в день подписания договора.',
      ]),
      clause('2.4', 'Вызов Заказчика на приёмку изделия осуществляется Исполнителем не позднее чем за 3 (три) календарных дня до указанного срока любым удобным способом — телефонным звонком, по электронной почте либо сообщением на телефон Заказчика.'),
      clause('2.5', 'Работы по установке изделия на захоронение и демонтажу существующих на захоронении конструкций оплачиваются Заказчиком дополнительно по действующим тарифам Исполнителя (исходя из объёма и сложности работ). Оплата производится в день выполнения соответствующих работ.'),
      clause('2.6', 'В случае, если Заказчику не требуются работы по установке изделия на захоронение, Заказчик дополнительно оплачивает стоимость погрузки изделия в транспорт.'),
      clause('2.7', 'Все расчёты по договору производятся в белорусских рублях наличным или безналичным платежом по реквизитам Исполнителя.'),

      { text: '', pageBreak: 'after' },

      // 3. Права и обязанности сторон
      section('3. ПРАВА И ОБЯЗАННОСТИ СТОРОН'),
      { text: '3.1. Заказчик имеет право:', bold: true, margin: [0, 0, 0, 4] },
      clause('3.1.1', `Вносить изменения в содержание или объём работ. При этом Исполнитель вправе без дополнительного уведомления Заказчика увеличить срок выполнения работ на 15 (пятнадцать) календарных дней с момента внесения последнего изменения. Изменения, внесённые по истечении 3 (трёх) рабочих дней после заключения договора и влекущие дополнительные затраты, оплачиваются Заказчиком согласно расценкам Исполнителя. При отказе Заказчика от оплаты таких изменений Исполнитель вправе в одностороннем порядке расторгнуть договор и возвратить Заказчику внесённую оплату за вычетом затрат, понесённых к этому времени.`),
      clause('3.1.2', `В случае, если до изготовления Исполнителем изделия Заказчик по собственной инициативе отказывается от дальнейшего исполнения обязательств, Заказчик уплачивает Исполнителю вознаграждение пропорционально фактически выполненному объёму работ, а также компенсацию в размере ${CANCELLATION_FEE_PERCENT}% от общей цены договора.`),

      { text: '3.2. Заказчик обязан:', bold: true, margin: [0, 6, 0, 4] },
      clause('3.2.1', 'Своевременно оплачивать работы Исполнителя в соответствии с условиями настоящего договора.'),
      clause('3.2.2', 'Предоставить Исполнителю необходимые для изготовления изделия данные и образцы (фотографии для портретов, тексты эпитафий, символику) в день подписания договора.'),
      clause('3.2.3', 'Принять услугу по демонтажу существующих конструкций и установке памятника на захоронение путём подписания соответствующего акта непосредственно по окончании выполнения услуг (если они заказаны).'),
      clause('3.2.4', 'Проверить указанные в договоре и заказ-наряде персональные данные (ФИО Заказчика, ФИО увековечиваемого лица, даты, тексты надписей) и подтвердить их корректность подписью. Претензии по содержанию надписей, основанные на ошибках в предоставленных Заказчиком данных, не принимаются.'),

      { text: '3.3. Исполнитель имеет право:', bold: true, margin: [0, 6, 0, 4] },
      clause('3.3.1', 'Отложить срок изготовления изделия при просрочке Заказчиком оплаты аванса по п. 2.2 договора, а также на время, в течение которого Заказчик оформляет заказ-наряд либо предоставляет образцы материалов для выполнения надписей и изображений. Если просрочка внесения аванса составит более 1 (одного) календарного дня, Исполнитель вправе расторгнуть договор в одностороннем порядке, уведомив об этом Заказчика.'),
      clause('3.3.2', 'Определить место нанесения и взаиморасположение художественных объектов (надписей, рисунков и т. п.) по своему усмотрению в соответствии с обычной практикой (портрет 22×18 см; высота букв фамилии — 4,5 см; высота букв имени и отчества — 3,5 см; высота цифр — 3 см), если Заказчик не указал иного в заказ-наряде.'),
      clause('3.3.3', 'Увеличить срок выполнения работ на периоды, когда по просьбе Заказчика производятся изменения художественных элементов изображения по мотивам, не связанным с качеством их выполнения, — на срок, необходимый для выполнения пожеланий Заказчика.'),
      clause('3.3.4', 'Отсрочить выполнение заказа в случае непредвиденных форс-мажорных обстоятельств: военных действий, эпидемий, землетрясений, пожаров, аварий транспортных средств, перевозящих продукцию по настоящему договору, выхода законодательных актов и действий административных органов, препятствующих исполнению обязательств, а также иных обстоятельств непреодолимой силы, предусмотренных законодательством Республики Беларусь.'),

      { text: '3.4. Исполнитель обязан:', bold: true, margin: [0, 6, 0, 4] },
      clause('3.4.1', 'Приступить к работе по изготовлению изделия незамедлительно после получения авансового платежа по п. 2.2 настоящего договора.'),
      clause('3.4.2', 'Осуществить изготовление и (при заказе установки) установку памятника в сроки, предусмотренные договором.'),
      clause('3.4.3', 'Обеспечить содержание и сохранность изделия до выполнения Заказчиком условий настоящего договора на условиях, установленных разделом 4 настоящего договора.'),
      clause('3.4.4', 'В случае возникновения обстоятельств, замедляющих ход работ или делающих их продолжение невозможным, незамедлительно поставить об этом в известность Заказчика.'),

      // 4. Хранение изделия
      section('4. ХРАНЕНИЕ ИЗДЕЛИЯ'),
      clause('4.1', 'Хранение готового изделия осуществляется Исполнителем бесплатно.'),
      clause('4.2', 'Исполнитель вправе не передавать Заказчику готовое изделие до внесения Заказчиком остатка платежа.'),
      clause('4.3', `Если по истечении ${STORAGE_LIMIT_YEARS} (одного) года с момента уведомления о готовности изделия Заказчик за ним не явится, Исполнитель вправе по своему усмотрению в судебном порядке потребовать от Заказчика исполнения обязательств либо распорядиться изделием для покрытия своих расходов по его изготовлению и хранению.`),

      // 5. Установка изделия
      section('5. УСТАНОВКА ИЗДЕЛИЯ'),
      clause('5.1', 'Заказ услуг по установке изделия и (при необходимости) демонтажу существующих на захоронении конструкций осуществляется путём оформления соответствующих разделов заказ-наряда.'),
      clause('5.2', cemeteryLine
        ? [
            'Место установки изделия: ',
            { text: cemeteryLine, italics: true },
            '. Заказчик обязан заблаговременно подготовить место для установки памятника и обеспечить Исполнителю беспрепятственный доступ к нему. За срыв работ по причинам, зависящим от Заказчика (отсутствие на месте установки в согласованный срок, отсутствие допуска и т. п.), Заказчик оплачивает дополнительные расходы за погрузочно-разгрузочные работы и доставку в размере 15% от стоимости монтажных работ.',
          ]
        : 'Заказчик обязан заблаговременно подготовить место для установки памятника и обеспечить Исполнителю беспрепятственный доступ к нему. За срыв работ по причинам, зависящим от Заказчика, последний оплачивает дополнительные расходы за погрузочно-разгрузочные работы и доставку в размере 15% от стоимости монтажных работ.'),
      clause('5.3', 'Исполнитель вправе не приступать к оказанию услуг по установке памятника до полной оплаты Заказчиком стоимости его изготовления.'),
      clause('5.4', 'Заказчик самостоятельно освобождает место захоронения от демонтированных Исполнителем конструкций либо оплачивает услуги Исполнителя по их доставке в указанное Заказчиком место или утилизации по тарифам Исполнителя.'),
      clause('5.5', 'Исполнитель вправе отсрочить установку изделия в случае неблагоприятных погодных условий (дождь, снег, заморозки, мёрзлый грунт), а также при наступлении обстоятельств непреодолимой силы. О новой дате установки Исполнитель уведомляет Заказчика.'),

      // 6. Гарантии и эксплуатация
      section('6. ПРАВИЛА ЭКСПЛУАТАЦИИ И ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА'),
      clause('6.1', [
        'Гарантийные сроки на изделие и работы:\n',
        `• на установку памятника — ${WARRANTY_INSTALL_YEARS} года (при установке не ранее чем через 1 год с момента захоронения);\n`,
        `• на естественное разрушение изделия — ${WARRANTY_PRODUCT_YEARS} лет.`,
      ]),
      clause('6.2', 'Заказчик предупреждён, что изделие изготавливается из природного материала (гранит, мрамор и т. д.). Образцы материала дают лишь общее представление о типе камня; все нюансы оттенков, рисунка прожилок и природных включений не могут быть точно воспроизведены. Возможны вариации размеров (по высоте, ширине и толщине) в пределах 10 мм от заказанного размера, а также вариации цвета и фактуры. Подобные вариации не являются дефектом и не служат основанием для отказа от изделия.'),
      clause('6.3', 'Заказчик предупреждён, что нанесённые на памятник изображения и художественные элементы выполняются вручную и являются индивидуальными. В силу особенностей гравировки на природной поверхности изображение может отличаться от фотографии-оригинала цветопередачей, оттенками и передачей отдельных деталей. Претензии по мотивам сходства фотографического изображения с гравировкой не принимаются, кроме случаев, когда очевидно установлено, что на памятнике изображено лицо, отличное от представленного образца.'),
      clause('6.4', 'В процессе эксплуатации памятник следует мыть только водой. Запрещается контакт с открытым огнём, удары тяжёлыми предметами, очистка механическими и абразивными средствами.'),
      clause('6.5', 'Заказчик предупреждён, что природный камень, обладая высокой твёрдостью, одновременно является хрупким материалом. При самостоятельной транспортировке и установке необходимо принимать соответствующие меры предосторожности.'),
      clause('6.6', 'При обнаружении дефектов изделия или установки в течение гарантийного срока Заказчик имеет право на их безвозмездное устранение при наличии заказ-наряда и при условии нормальной эксплуатации. Изделие и установка снимаются с гарантийного обслуживания при наличии механических повреждений, повреждений, возникших в результате самостоятельного ремонта, стихийных бедствий, пожара и иных климатических воздействий.'),
      clause('6.7', 'Заказчик предупреждён, что после установки памятника и иных надмогильных конструкций возможно отклонение по осям в пределах 10 мм (по отношению к размеру 1000×500×80 мм), обусловленное особенностями рельефа грунта, корнями деревьев и расположением соседних конструкций. Указанное отклонение не является дефектом и не подлежит устранению.'),

      // 7. Ответственность сторон
      section('7. ОТВЕТСТВЕННОСТЬ СТОРОН'),
      clause('7.1', 'За нарушение сроков изготовления или установки изделия Исполнитель несёт ответственность, установленную законодательством Республики Беларусь о защите прав потребителей.'),
      clause('7.2', `За нарушение сроков оплаты работ по изготовлению изделия, услуг по его установке и демонтажу существующих на захоронении конструкций Заказчик уплачивает Исполнителю пеню в размере ${PENALTY_PERCENT_PER_DAY}% от суммы задолженности за каждый день просрочки.`),

      // 8. Обработка персональных данных
      section('8. ОБРАБОТКА ПЕРСОНАЛЬНЫХ ДАННЫХ'),
      clause('8.1', 'Подписывая настоящий договор, Заказчик в соответствии с Законом Республики Беларусь «О защите персональных данных» от 7 мая 2021 г. № 99-З даёт Исполнителю согласие на обработку своих персональных данных, а также персональных данных увековечиваемого лица, указанных в заказ-наряде, в целях исполнения настоящего договора.'),
      clause('8.2', 'Обработка персональных данных осуществляется в течение срока действия настоящего договора и в течение сроков хранения документов, установленных законодательством Республики Беларусь. Заказчик вправе отозвать согласие в порядке, установленном законодательством.'),

      // 9. Прочие условия
      section('9. ПРОЧИЕ УСЛОВИЯ'),
      clause('9.1', 'Договор составлен в двух экземплярах, имеющих равную юридическую силу, по одному для каждой из сторон. Договор вступает в силу с момента его подписания и действует до полного исполнения сторонами своих обязательств. Изменения и дополнения оформляются дополнительными соглашениями в письменной форме.'),
      clause('9.2', 'Споры сторон разрешаются путём переговоров, а при невозможности достижения согласия — в судебном порядке по месту нахождения Исполнителя в соответствии с законодательством Республики Беларусь.'),
      clause('9.3', 'Во всём, что прямо не урегулировано настоящим договором, стороны руководствуются положениями действующего законодательства Республики Беларусь о подряде и возмездном оказании услуг.'),

      // Реквизиты сторон
      section('10. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'ИСПОЛНИТЕЛЬ', style: 'partyHeader' },
              { text: 'ЗАКАЗЧИК', style: 'partyHeader' },
            ],
            [
              {
                stack: [
                  { text: companyDisplayName, bold: true },
                  { text: company.legal_address?.trim() || company.address, margin: [0, 4, 0, 0] },
                  { text: `Тел.: ${company.phone}` },
                  { text: `E-mail: ${company.email}` },
                  company.unp ? { text: `УНП: ${company.unp}`, margin: [0, 4, 0, 0] } : { text: '' },
                  company.bank_name ? { text: `Банк: ${company.bank_name}` } : { text: '' },
                  company.bank_account ? { text: `Р/с: ${company.bank_account}` } : { text: '' },
                  company.bik ? { text: `БИК: ${company.bik}` } : { text: '' },
                  { text: '\n\nДиректор', margin: [0, 12, 0, 0] },
                  {
                    canvas: [
                      { type: 'line', x1: 0, y1: 6, x2: 200, y2: 6, lineWidth: 0.5 },
                    ],
                    margin: [0, 14, 0, 0],
                  },
                  {
                    text: `${directorName}    М.П.`,
                    margin: [0, 2, 0, 0],
                    fontSize: 9,
                    color: '#555',
                  },
                ],
                style: 'partyCell',
              },
              {
                stack: [
                  { text: customerName, bold: true },
                  { text: `Адрес: ${customerAddress}`, margin: [0, 4, 0, 0] },
                  { text: `Паспорт: ${passportLine}` },
                  { text: `Выдан: ${issuedBy}` },
                  order.customer.personal_number
                    ? { text: `Личный номер: ${order.customer.personal_number}` }
                    : { text: '' },
                  { text: `Тел.: ${customerPhone}`, margin: [0, 4, 0, 0] },
                  { text: `E-mail: ${customerEmail}` },
                  { text: '\n\nПодпись', margin: [0, 12, 0, 0] },
                  {
                    canvas: [
                      { type: 'line', x1: 0, y1: 6, x2: 200, y2: 6, lineWidth: 0.5 },
                    ],
                    margin: [0, 14, 0, 0],
                  },
                  {
                    text: `${customerName}`,
                    margin: [0, 2, 0, 0],
                    fontSize: 9,
                    color: '#555',
                  },
                ],
                style: 'partyCell',
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cccccc',
          vLineColor: () => '#cccccc',
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 8,
          paddingBottom: () => 10,
        },
        margin: [0, 0, 0, 8],
      },
    ],
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        {
          text: companyDisplayName,
          fontSize: 8,
          color: '#888',
          margin: [40, 20, 0, 0],
        },
        {
          text: `Стр. ${currentPage} из ${pageCount}  •  Договор ${orderRef}`,
          fontSize: 8,
          color: '#888',
          alignment: 'right',
          margin: [0, 20, 40, 0],
        },
      ],
    }),
    styles: {
      brand: { fontSize: 16, bold: true, color: BRAND_COLOR },
      companyMeta: { fontSize: 8.5, color: '#555', margin: [0, 1, 0, 1] },
      docTitle: { fontSize: 20, bold: true, color: ACCENT_COLOR, characterSpacing: 3 },
      docNumber: { fontSize: 12, bold: true, color: BRAND_COLOR, margin: [0, 2, 0, 0] },
      docDate: { fontSize: 9, color: '#777', margin: [0, 2, 0, 0] },
      sectionTitle: { fontSize: 11, bold: true, color: BRAND_COLOR, characterSpacing: 0.5 },
      clauseNumber: { fontSize: 9, color: BRAND_COLOR },
      clauseBody: { fontSize: 9.5, alignment: 'justify', color: '#222' },
      tableHeader: { color: 'white', bold: true, fontSize: 9 },
      partyHeader: { bold: true, color: 'white', fillColor: BRAND_COLOR, alignment: 'center', fontSize: 10, margin: [0, 4, 0, 4] },
      partyCell: { fontSize: 9, color: '#222' },
    },
    defaultStyle: { font: 'Roboto', fontSize: 9.5, color: '#222', lineHeight: 1.25 },
  };

  const pdf = (pdfMake as any).createPdf(docDefinition);
  const safeRef = orderRef.replace(/[\\/:*?"<>|]+/g, '_');
  const fileName = `Договор_${safeRef}.pdf`;

  if (download) {
    pdf.download(fileName);
    return;
  }

  return new Promise<Blob>((resolve) => {
    pdf.getBlob((blob: Blob) => resolve(blob));
  });
}
