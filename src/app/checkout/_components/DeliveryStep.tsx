'use client';

import React from 'react';
import { Alert, Box, Stack, TextField } from '@mui/material';
import type { DeliveryData } from '../_types';

interface DeliveryStepProps {
  data: DeliveryData;
  onChange: (updater: (prev: DeliveryData) => DeliveryData) => void;
}

export default function DeliveryStep({ data, onChange }: DeliveryStepProps) {
  const setField = <K extends keyof DeliveryData>(field: K, value: DeliveryData[K]) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={3}>
      <Alert severity="info" variant="outlined">
        Укажите место, куда нужно доставить и установить памятник. Если точную дату назвать сложно — оставьте поле пустым, согласуем её при подтверждении заказа.
      </Alert>

      <TextField
        label="Адрес кладбища"
        value={data.cemetery_address}
        onChange={(e) => setField('cemetery_address', e.target.value)}
        required
        fullWidth
        helperText="Например: Гродненский р-н, Луцковляны, гражданское кладбище"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Название кладбища"
          value={data.cemetery_name}
          onChange={(e) => setField('cemetery_name', e.target.value)}
          fullWidth
        />
        <TextField
          label="Город / нас. пункт"
          value={data.city}
          onChange={(e) => setField('city', e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Область / район"
          value={data.region}
          onChange={(e) => setField('region', e.target.value)}
          fullWidth
        />
        <TextField
          label="Желаемая дата установки"
          type="date"
          value={data.preferred_date}
          onChange={(e) => setField('preferred_date', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>

      <TextField
        label="Телефон для координации доставки"
        value={data.contact_phone}
        onChange={(e) => setField('contact_phone', e.target.value)}
        required
        fullWidth
        helperText="По этому номеру водитель свяжется в день доставки"
      />

      <TextField
        label="Комментарий для бригады"
        value={data.comment}
        onChange={(e) => setField('comment', e.target.value)}
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        helperText="Особенности подъезда, ориентиры, имя смотрителя — всё, что упростит установку"
      />
    </Stack>
  );
}
