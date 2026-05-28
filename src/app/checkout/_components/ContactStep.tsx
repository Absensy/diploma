'use client';

import React from 'react';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { CONTACT_METHOD_LABELS, type ContactData, type ContactMethod } from '../_types';

interface ContactStepProps {
  data: ContactData;
  onChange: (updater: (prev: ContactData) => ContactData) => void;
}

export default function ContactStep({ data, onChange }: ContactStepProps) {
  const setField = <K extends keyof ContactData>(field: K, value: ContactData[K]) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={3}>
      <Alert severity="info" variant="outlined">
        По этим данным с вами свяжется менеджер. Регистрация не нужна — мы оформим заказ как гостевой.
      </Alert>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Фамилия"
          value={data.last_name}
          onChange={(e) => setField('last_name', e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Имя"
          value={data.first_name}
          onChange={(e) => setField('first_name', e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Отчество"
          value={data.patronymic}
          onChange={(e) => setField('patronymic', e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Телефон"
          type="tel"
          value={data.phone}
          onChange={(e) => setField('phone', e.target.value)}
          required
          fullWidth
          helperText="Основной номер для связи"
        />
        <TextField
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setField('email', e.target.value)}
          fullWidth
          helperText="На него отправим подтверждение заказа"
        />
      </Box>

      <FormControl fullWidth>
        <InputLabel id="preferred-contact-label">Предпочитаемый способ связи</InputLabel>
        <Select
          labelId="preferred-contact-label"
          label="Предпочитаемый способ связи"
          value={data.preferred_contact}
          onChange={(e) => setField('preferred_contact', e.target.value as ContactMethod | '')}
        >
          <MenuItem value="">
            <em>Не имеет значения</em>
          </MenuItem>
          {(Object.entries(CONTACT_METHOD_LABELS) as [ContactMethod, string][]).map(
            ([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ),
          )}
        </Select>
      </FormControl>

      <TextField
        label="Комментарий к заказу"
        value={data.comment}
        onChange={(e) => setField('comment', e.target.value)}
        fullWidth
        multiline
        minRows={2}
        maxRows={5}
        helperText="Любая дополнительная информация: удобное время связи, особые пожелания, вопросы"
      />
    </Stack>
  );
}
