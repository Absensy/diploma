'use client';

import React, { useMemo } from 'react';
import { Alert, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import type { CartItem } from '@/contexts/CartContext';
import {
  AdditionalServiceDTO,
  CONTACT_METHOD_LABELS,
  CheckoutState,
  SERVICE_UNIT_LABELS,
  SYMBOL_LABELS,
} from '../_types';

interface ReviewStepProps {
  items: CartItem[];
  services: AdditionalServiceDTO[];
  state: CheckoutState;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('ru-RU');
}

export default function ReviewStep({ items, services, state }: ReviewStepProps) {
  const itemsRequiringPersonalization = useMemo(
    () => items.filter((i) => i.requires_personalization),
    [items],
  );

  const selectedServices = useMemo(
    () =>
      state.services
        .map((sel) => {
          const svc = services.find((s) => s.id === sel.service_id);
          if (!svc) return null;
          return { svc, quantity: sel.quantity };
        })
        .filter((x): x is { svc: AdditionalServiceDTO; quantity: number } => x !== null),
    [state.services, services],
  );

  return (
    <Stack spacing={3}>
      <Alert severity="info" variant="outlined">
        Проверьте данные перед отправкой. После нажатия «Оформить заказ» вы получите номер для отслеживания, а наш менеджер свяжется с вами в ближайшее время.
      </Alert>

      {/* Товары */}
      <Section title="Товары в заказе">
        <Stack spacing={1.5}>
          {items.map((item, idx) => {
            const personalization = state.personalizations[item.cart_item_id];
            const isPersonal = item.requires_personalization;
            const numbered = isPersonal
              ? `Памятник №${
                  itemsRequiringPersonalization.findIndex((x) => x.cart_item_id === item.cart_item_id) + 1
                }`
              : `Позиция №${idx + 1}`;

            return (
              <Paper key={item.cart_item_id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      position: 'relative',
                      flexShrink: 0,
                      borderRadius: 1,
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="overline" color="text.secondary">
                      {numbered}
                    </Typography>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.quantity} × {(item.discounted_price ?? item.price).toLocaleString('ru-RU')} BYN
                    </Typography>
                  </Box>
                </Box>

                {isPersonal && personalization && (
                  <Box sx={{ mt: 1.5, pl: { sm: 10 } }}>
                    <FieldRow
                      label="ФИО"
                      value={[personalization.last_name, personalization.first_name, personalization.patronymic]
                        .filter(Boolean)
                        .join(' ') || '—'}
                    />
                    <FieldRow
                      label="Годы жизни"
                      value={`${formatDate(personalization.birth_date)} — ${formatDate(personalization.death_date)}`}
                    />
                    <FieldRow label="Символ" value={SYMBOL_LABELS[personalization.symbol]} />
                    {personalization.epitaph && (
                      <FieldRow label="Эпитафия" value={personalization.epitaph} />
                    )}
                    <FieldRow
                      label="Фото для портрета"
                      value={personalization.portrait_photo ? 'Загружено' : 'Будет согласовано отдельно'}
                    />
                    {personalization.notes && (
                      <FieldRow label="Примечания" value={personalization.notes} />
                    )}
                  </Box>
                )}
              </Paper>
            );
          })}
        </Stack>
      </Section>

      {/* Услуги */}
      <Section title="Дополнительные услуги">
        {selectedServices.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Не выбраны
          </Typography>
        ) : (
          <Stack spacing={1}>
            {selectedServices.map(({ svc, quantity }) => (
              <Box
                key={svc.id}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography variant="body2">{svc.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {quantity} × {svc.price.toLocaleString('ru-RU')} BYN {SERVICE_UNIT_LABELS[svc.unit]}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {(svc.price * quantity).toLocaleString('ru-RU')} BYN
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Section>

      {/* Доставка */}
      <Section title="Доставка">
        {!state.delivery.cemetery_address ? (
          <Typography variant="body2" color="text.secondary">
            Не указана — согласуем с менеджером
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {state.delivery.cemetery_name && (
              <FieldRow label="Кладбище" value={state.delivery.cemetery_name} />
            )}
            <FieldRow label="Адрес" value={state.delivery.cemetery_address} />
            {(state.delivery.city || state.delivery.region) && (
              <FieldRow
                label="Город / регион"
                value={[state.delivery.city, state.delivery.region].filter(Boolean).join(', ')}
              />
            )}
            <FieldRow label="Телефон" value={state.delivery.contact_phone} />
            <FieldRow label="Желаемая дата" value={formatDate(state.delivery.preferred_date)} />
            {state.delivery.comment && (
              <FieldRow label="Комментарий" value={state.delivery.comment} />
            )}
          </Stack>
        )}
      </Section>

      {/* Контакты */}
      <Section title="Контактные данные">
        <Stack spacing={0.5}>
          <FieldRow
            label="ФИО"
            value={
              [state.contact.last_name, state.contact.first_name, state.contact.patronymic]
                .filter(Boolean)
                .join(' ') || '—'
            }
          />
          <FieldRow label="Телефон" value={state.contact.phone || '—'} />
          {state.contact.email && <FieldRow label="Email" value={state.contact.email} />}
          <Box sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              variant="outlined"
              label={
                state.contact.preferred_contact
                  ? `Предпочитаем: ${CONTACT_METHOD_LABELS[state.contact.preferred_contact]}`
                  : 'Способ связи: не имеет значения'
              }
            />
          </Box>
          {state.contact.comment && (
            <FieldRow label="Комментарий" value={state.contact.comment} />
          )}
        </Stack>
      </Section>
    </Stack>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Divider sx={{ mb: 1.5 }} />
      {children}
    </Box>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 140, pt: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>
        {value}
      </Typography>
    </Box>
  );
}
