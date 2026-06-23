'use client';

import React from 'react';
import { Alert, Box, Stack, TextField } from '@mui/material';
import type { DeliveryData } from '../_types';
import { getDeliveryErrors } from '../_validation';

interface DeliveryStepProps {
  data: DeliveryData;
  onChange: (updater: (prev: DeliveryData) => DeliveryData) => void;
}

export default function DeliveryStep({ data, onChange }: DeliveryStepProps) {
  const [touched, setTouched] = React.useState<Partial<Record<keyof DeliveryData, boolean>>>({});

  const setField = <K extends keyof DeliveryData>(field: K, value: DeliveryData[K]) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: keyof DeliveryData) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const errors = getDeliveryErrors(data);
  const errOf = (field: keyof DeliveryData) => (touched[field] ? errors[field] : undefined);

  return (
    <Stack spacing={3}>
      <Alert severity="info" variant="outlined">
        Укажите место, куда нужно доставить и установить памятник. Если точную дату назвать сложно — оставьте поле пустым, согласуем её при подтверждении заказа.
      </Alert>

      <TextField
        label="Адрес кладбища"
        value={data.cemetery_address}
        onChange={(e) => setField('cemetery_address', e.target.value)}
        onBlur={() => markTouched('cemetery_address')}
        error={Boolean(errOf('cemetery_address'))}
        required
        fullWidth
        helperText={
          errOf('cemetery_address') ??
          'Например: Гродненский р-н, Луцковляны, гражданское кладбище'
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Название кладбища"
          value={data.cemetery_name}
          onChange={(e) => setField('cemetery_name', e.target.value)}
          onBlur={() => markTouched('cemetery_name')}
          error={Boolean(errOf('cemetery_name'))}
          helperText={errOf('cemetery_name')}
          fullWidth
        />
        <TextField
          label="Город / нас. пункт"
          value={data.city}
          onChange={(e) => setField('city', e.target.value)}
          onBlur={() => markTouched('city')}
          error={Boolean(errOf('city'))}
          helperText={errOf('city')}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Область / район"
          value={data.region}
          onChange={(e) => setField('region', e.target.value)}
          onBlur={() => markTouched('region')}
          error={Boolean(errOf('region'))}
          helperText={errOf('region')}
          fullWidth
        />
        <TextField
          label="Желаемая дата установки"
          type="date"
          value={data.preferred_date}
          onChange={(e) => setField('preferred_date', e.target.value)}
          onBlur={() => markTouched('preferred_date')}
          error={Boolean(errOf('preferred_date'))}
          helperText={errOf('preferred_date')}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>

      <TextField
        label="Телефон для координации доставки"
        type="tel"
        value={data.contact_phone}
        onChange={(e) => setField('contact_phone', e.target.value)}
        onBlur={() => markTouched('contact_phone')}
        error={Boolean(errOf('contact_phone'))}
        required
        fullWidth
        helperText={errOf('contact_phone') ?? 'По этому номеру водитель свяжется в день доставки'}
      />

      <TextField
        label="Комментарий для бригады"
        value={data.comment}
        onChange={(e) => setField('comment', e.target.value)}
        onBlur={() => markTouched('comment')}
        error={Boolean(errOf('comment'))}
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        helperText={
          errOf('comment') ??
          'Особенности подъезда, ориентиры, имя смотрителя — всё, что упростит установку'
        }
      />
    </Stack>
  );
}
