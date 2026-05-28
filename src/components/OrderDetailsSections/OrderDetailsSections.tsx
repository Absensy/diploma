'use client';

import React from 'react';
import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import {
  CONTACT_METHOD_LABELS,
  ContactMethod,
  PersonalizationSymbol,
  SERVICE_CATEGORY_LABELS,
  SERVICE_UNIT_LABELS,
  ServiceCategory,
  ServiceUnit,
  SYMBOL_LABELS,
} from '@/lib/orderLabels';

export interface OrderPersonalization {
  first_name: string;
  last_name: string;
  patronymic: string | null;
  birth_date: string | null;
  death_date: string | null;
  portrait_photo: string | null;
  epitaph: string | null;
  symbol: PersonalizationSymbol;
  notes: string | null;
}

export interface OrderDetailsItem {
  id: number;
  quantity: number;
  product: { id: number; name: string; image: string } | null;
  personalization?: OrderPersonalization | null;
}

export interface OrderDetailsService {
  id: number;
  quantity: number;
  price_at_purchase: number;
  service: {
    id: number;
    name: string;
    category: ServiceCategory;
    unit: ServiceUnit;
  };
}

export interface OrderDetailsDelivery {
  cemetery_name: string | null;
  cemetery_address: string;
  city: string | null;
  region: string | null;
  contact_phone: string;
  preferred_date: string | null;
  comment: string | null;
}

export interface OrderDetailsData {
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  contact_patronymic?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  preferred_contact?: ContactMethod | null;
  customer_comment?: string | null;
  order_items: OrderDetailsItem[];
  additional_services?: OrderDetailsService[];
  delivery?: OrderDetailsDelivery | null;
}

interface OrderDetailsSectionsProps {
  order: OrderDetailsData;
  /**
   * Когда true (профиль клиента), секция "Контакты клиента" скрывается —
   * клиент уже видит свои данные в шапке профиля.
   */
  hideGuestContact?: boolean;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('ru-RU');
}

export default function OrderDetailsSections({
  order,
  hideGuestContact,
}: OrderDetailsSectionsProps) {
  const personalizedItems = order.order_items.filter((i) => i.personalization);
  const services = order.additional_services ?? [];
  const hasContactInfo =
    !hideGuestContact &&
    (order.contact_first_name ||
      order.contact_last_name ||
      order.contact_phone ||
      order.contact_email ||
      order.preferred_contact ||
      order.customer_comment);

  if (personalizedItems.length === 0 && services.length === 0 && !order.delivery && !hasContactInfo) {
    return null;
  }

  return (
    <Stack spacing={3}>
      {personalizedItems.length > 0 && (
        <Section title="Персонализация памятников">
          <Stack spacing={2}>
            {personalizedItems.map((item, idx) => (
              <PersonalizationCard
                key={item.id}
                index={idx + 1}
                item={item}
                personalization={item.personalization!}
              />
            ))}
          </Stack>
        </Section>
      )}

      {services.length > 0 && <ServicesSection services={services} />}

      {order.delivery && <DeliverySection delivery={order.delivery} />}

      {hasContactInfo && <ContactSection order={order} />}
    </Stack>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 1.5 }} />
      {children}
    </Box>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 130, pt: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  );
}

function PersonalizationCard({
  index,
  item,
  personalization,
}: {
  index: number;
  item: OrderDetailsItem;
  personalization: OrderPersonalization;
}) {
  const fullName = [personalization.last_name, personalization.first_name, personalization.patronymic]
    .filter(Boolean)
    .join(' ') || '—';

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
        {item.product?.image && (
          <Box
            sx={{
              width: 56,
              height: 56,
              position: 'relative',
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            Памятник №{index}
          </Typography>
          <Typography variant="subtitle2">{item.product?.name ?? 'Удалённый товар'}</Typography>
        </Box>
        {personalization.portrait_photo && (
          <Box
            sx={{
              width: 56,
              height: 72,
              position: 'relative',
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              border: '1px solid',
              borderColor: 'divider',
            }}
            title="Фото для портрета"
          >
            <Image
              src={personalization.portrait_photo}
              alt="Фото портрета"
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}
      </Box>

      <Stack spacing={0.75}>
        <FieldRow label="ФИО" value={fullName} />
        <FieldRow
          label="Годы жизни"
          value={`${formatDate(personalization.birth_date)} — ${formatDate(personalization.death_date)}`}
        />
        <FieldRow label="Символ" value={SYMBOL_LABELS[personalization.symbol]} />
        {personalization.epitaph && <FieldRow label="Эпитафия" value={personalization.epitaph} />}
        <FieldRow
          label="Фото портрета"
          value={personalization.portrait_photo ? 'Загружено' : 'Не приложено'}
        />
        {personalization.notes && <FieldRow label="Примечания" value={personalization.notes} />}
      </Stack>
    </Paper>
  );
}

function ServicesSection({ services }: { services: OrderDetailsService[] }) {
  const grouped = new Map<ServiceCategory, OrderDetailsService[]>();
  for (const s of services) {
    const list = grouped.get(s.service.category) ?? [];
    list.push(s);
    grouped.set(s.service.category, list);
  }

  const total = services.reduce((sum, s) => sum + s.price_at_purchase * s.quantity, 0);

  return (
    <Section title="Дополнительные услуги">
      <Stack spacing={1.5}>
        {Array.from(grouped.entries()).map(([category, list]) => (
          <Box key={category}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {SERVICE_CATEGORY_LABELS[category]}
            </Typography>
            <Stack spacing={0.75}>
              {list.map((row) => (
                <Box
                  key={row.id}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2">{row.service.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.quantity} × {row.price_at_purchase.toLocaleString('ru-RU')} BYN{' '}
                      {SERVICE_UNIT_LABELS[row.service.unit]}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {(row.price_at_purchase * row.quantity).toLocaleString('ru-RU')} BYN
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Итого по услугам
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {total.toLocaleString('ru-RU')} BYN
          </Typography>
        </Box>
      </Stack>
    </Section>
  );
}

function DeliverySection({ delivery }: { delivery: OrderDetailsDelivery }) {
  const cityRegion = [delivery.city, delivery.region].filter(Boolean).join(', ');
  return (
    <Section title="Доставка и установка">
      <Stack spacing={0.75}>
        {delivery.cemetery_name && <FieldRow label="Кладбище" value={delivery.cemetery_name} />}
        <FieldRow label="Адрес" value={delivery.cemetery_address} />
        {cityRegion && <FieldRow label="Город / регион" value={cityRegion} />}
        <FieldRow label="Телефон координации" value={delivery.contact_phone} />
        <FieldRow label="Желаемая дата" value={formatDate(delivery.preferred_date)} />
        {delivery.comment && <FieldRow label="Комментарий" value={delivery.comment} />}
      </Stack>
    </Section>
  );
}

function ContactSection({ order }: { order: OrderDetailsData }) {
  const fullName = [order.contact_last_name, order.contact_first_name, order.contact_patronymic]
    .filter(Boolean)
    .join(' ');

  return (
    <Section title="Контакты клиента (гостевой заказ)">
      <Stack spacing={0.75}>
        {fullName && <FieldRow label="ФИО" value={fullName} />}
        {order.contact_phone && <FieldRow label="Телефон" value={order.contact_phone} />}
        {order.contact_email && <FieldRow label="Email" value={order.contact_email} />}
        {order.preferred_contact && (
          <Box sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              variant="outlined"
              label={`Предпочитает: ${CONTACT_METHOD_LABELS[order.preferred_contact]}`}
            />
          </Box>
        )}
        {order.customer_comment && (
          <FieldRow label="Комментарий" value={order.customer_comment} />
        )}
      </Stack>
    </Section>
  );
}
