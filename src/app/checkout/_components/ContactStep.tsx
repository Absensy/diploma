'use client';

import React from 'react';
import {
  Alert,
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CONTACT_METHOD_LABELS, type ContactData, type ContactMethod } from '../_types';
import { getContactErrors } from '../_validation';

interface ContactStepProps {
  data: ContactData;
  onChange: (updater: (prev: ContactData) => ContactData) => void;
}

export default function ContactStep({ data, onChange }: ContactStepProps) {
  const [touched, setTouched] = React.useState<Partial<Record<keyof ContactData, boolean>>>({});

  const setField = <K extends keyof ContactData>(field: K, value: ContactData[K]) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: keyof ContactData) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const errors = getContactErrors(data);
  // Сообщение показываем только после того, как пользователь побывал в поле,
  // чтобы форма не «краснела» сразу при открытии шага.
  const errOf = (field: keyof ContactData) => (touched[field] ? errors[field] : undefined);

  return (
    <Stack spacing={3}>
      <Alert severity="info" variant="outlined">
        Эти данные используются для оформления договора изготовления и установки памятника. По ним с
        вами свяжется менеджер. Регистрация не нужна — мы оформим заказ как гостевой.
      </Alert>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Фамилия"
          value={data.last_name}
          onChange={(e) => setField('last_name', e.target.value)}
          onBlur={() => markTouched('last_name')}
          error={Boolean(errOf('last_name'))}
          helperText={errOf('last_name')}
          required
          fullWidth
        />
        <TextField
          label="Имя"
          value={data.first_name}
          onChange={(e) => setField('first_name', e.target.value)}
          onBlur={() => markTouched('first_name')}
          error={Boolean(errOf('first_name'))}
          helperText={errOf('first_name')}
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
          onBlur={() => markTouched('phone')}
          error={Boolean(errOf('phone'))}
          required
          fullWidth
          helperText={errOf('phone') ?? 'Основной номер для связи'}
        />
        <TextField
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setField('email', e.target.value)}
          onBlur={() => markTouched('email')}
          error={Boolean(errOf('email'))}
          fullWidth
          helperText={errOf('email') ?? 'На него отправим подтверждение заказа'}
        />
      </Box>

      <Divider textAlign="left">
        <Typography variant="overline" color="text.secondary">
          Данные для договора
        </Typography>
      </Divider>

      <TextField
        label="Адрес проживания"
        value={data.address}
        onChange={(e) => setField('address', e.target.value)}
        onBlur={() => markTouched('address')}
        error={Boolean(errOf('address'))}
        required
        fullWidth
        helperText={errOf('address') ?? 'Город, улица, дом, квартира — для указания в договоре'}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Серия паспорта"
          value={data.passport_series}
          onChange={(e) => setField('passport_series', e.target.value.toUpperCase())}
          onBlur={() => markTouched('passport_series')}
          error={Boolean(errOf('passport_series'))}
          helperText={errOf('passport_series')}
          required
          fullWidth
          inputProps={{ maxLength: 4 }}
          placeholder="KH"
        />
        <TextField
          label="Номер паспорта"
          value={data.passport_number}
          onChange={(e) => setField('passport_number', e.target.value.replace(/\D/g, ''))}
          onBlur={() => markTouched('passport_number')}
          error={Boolean(errOf('passport_number'))}
          helperText={errOf('passport_number')}
          required
          fullWidth
          inputProps={{ maxLength: 9 }}
          placeholder="1234567"
        />
        <TextField
          label="Личный (идентификационный) номер"
          value={data.personal_number}
          onChange={(e) => setField('personal_number', e.target.value.toUpperCase())}
          onBlur={() => markTouched('personal_number')}
          error={Boolean(errOf('personal_number'))}
          helperText={errOf('personal_number')}
          fullWidth
          inputProps={{ maxLength: 14 }}
          placeholder="4140888K012PB1"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2 }}>
        <TextField
          label="Кем выдан"
          value={data.passport_issued_by}
          onChange={(e) => setField('passport_issued_by', e.target.value)}
          onBlur={() => markTouched('passport_issued_by')}
          error={Boolean(errOf('passport_issued_by'))}
          helperText={errOf('passport_issued_by')}
          required
          fullWidth
          placeholder="Например: Ленинским РОВД г. Гродно"
        />
        <TextField
          label="Дата выдачи"
          type="date"
          value={data.passport_issued_at}
          onChange={(e) => setField('passport_issued_at', e.target.value)}
          onBlur={() => markTouched('passport_issued_at')}
          error={Boolean(errOf('passport_issued_at'))}
          helperText={errOf('passport_issued_at')}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Divider textAlign="left">
        <Typography variant="overline" color="text.secondary">
          Связь с менеджером
        </Typography>
      </Divider>

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
