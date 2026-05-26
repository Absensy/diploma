import {
  ReceiptLong,
  Payments,
  Construction,
  LocalShipping,
  TaskAlt,
  Cancel,
  type SvgIconComponent,
} from '@mui/icons-material';

export type OrderStatus =
  | 'NEW'
  | 'PAID'
  | 'IN_PRODUCTION'
  | 'IN_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export type ChipColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';

export interface OrderStatusMeta {
  value: OrderStatus;
  label: string;
  shortLabel: string;
  description: string;
  color: ChipColor;
  hex: string;
  icon: SvgIconComponent;
  timestampField: 'order_date' | 'paid_at' | 'in_production_at' | 'in_delivery_at' | 'completed_at' | 'cancelled_at';
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  NEW: {
    value: 'NEW',
    label: 'Принят',
    shortLabel: 'Принят',
    description: 'Заказ оформлен. Менеджер свяжется для уточнения деталей и оплаты.',
    color: 'warning',
    hex: '#ed6c02',
    icon: ReceiptLong,
    timestampField: 'order_date',
  },
  PAID: {
    value: 'PAID',
    label: 'Оплачен',
    shortLabel: 'Оплачен',
    description: 'Оплата подтверждена. Заказ передан в производство.',
    color: 'info',
    hex: '#0288d1',
    icon: Payments,
    timestampField: 'paid_at',
  },
  IN_PRODUCTION: {
    value: 'IN_PRODUCTION',
    label: 'В производстве',
    shortLabel: 'Производство',
    description: 'Идёт изготовление изделия в мастерской.',
    color: 'secondary',
    hex: '#7b1fa2',
    icon: Construction,
    timestampField: 'in_production_at',
  },
  IN_DELIVERY: {
    value: 'IN_DELIVERY',
    label: 'В доставке',
    shortLabel: 'Доставка',
    description: 'Заказ передан в доставку и едет к клиенту.',
    color: 'primary',
    hex: '#1976d2',
    icon: LocalShipping,
    timestampField: 'in_delivery_at',
  },
  COMPLETED: {
    value: 'COMPLETED',
    label: 'Выполнен',
    shortLabel: 'Выполнен',
    description: 'Заказ доставлен и завершён.',
    color: 'success',
    hex: '#2e7d32',
    icon: TaskAlt,
    timestampField: 'completed_at',
  },
  CANCELLED: {
    value: 'CANCELLED',
    label: 'Отменён',
    shortLabel: 'Отменён',
    description: 'Заказ был отменён.',
    color: 'error',
    hex: '#d32f2f',
    icon: Cancel,
    timestampField: 'cancelled_at',
  },
};

// Активный поток заказа. Шаг PAID исключён: оплата принимается в фоне,
// а заказ переводится напрямую из NEW в IN_PRODUCTION.
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'NEW',
  'IN_PRODUCTION',
  'IN_DELIVERY',
  'COMPLETED',
];

// PAID сохранён в списке валидных статусов для совместимости с заказами,
// созданными до изменения потока.
export const ORDER_STATUS_LIST: OrderStatus[] = [
  ...ORDER_STATUS_FLOW,
  'PAID',
  'CANCELLED',
];

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW:           ['IN_PRODUCTION', 'CANCELLED'],
  PAID:          ['IN_PRODUCTION', 'CANCELLED'],
  IN_PRODUCTION: ['IN_DELIVERY'],
  IN_DELIVERY:   ['COMPLETED'],
  COMPLETED:     [],
  CANCELLED:     [],
};

export const TERMINAL_STATUSES: OrderStatus[] = ['COMPLETED', 'CANCELLED'];

export function getStatusMeta(status: OrderStatus): OrderStatusMeta {
  return ORDER_STATUS_META[status];
}

export function getStatusLabel(status: OrderStatus | string | null | undefined): string {
  if (!status) return '—';
  return ORDER_STATUS_META[status as OrderStatus]?.label ?? String(status);
}

export function getStatusColor(status: OrderStatus | string | null | undefined): ChipColor {
  if (!status) return 'default';
  return ORDER_STATUS_META[status as OrderStatus]?.color ?? 'default';
}

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'PAID') return 'IN_PRODUCTION';
  const flowIndex = ORDER_STATUS_FLOW.indexOf(status);
  if (flowIndex === -1 || flowIndex === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[flowIndex + 1];
}

export function canTransitionTo(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getStatusFlowIndex(status: OrderStatus): number {
  if (status === 'PAID') return ORDER_STATUS_FLOW.indexOf('IN_PRODUCTION');
  return ORDER_STATUS_FLOW.indexOf(status);
}
