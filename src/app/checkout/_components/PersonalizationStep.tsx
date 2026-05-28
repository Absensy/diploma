'use client';

import React from 'react';
import {
  Alert,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import type { CartItem } from '@/contexts/CartContext';
import {
  PersonalizationData,
  PersonalizationSymbol,
  SYMBOL_LABELS,
} from '../_types';

interface PersonalizationStepProps {
  items: CartItem[];
  getPersonalization: (cartItemId: string) => PersonalizationData;
  setPersonalization: (
    cartItemId: string,
    updater: (prev: PersonalizationData) => PersonalizationData,
  ) => void;
}

export default function PersonalizationStep({
  items,
  getPersonalization,
  setPersonalization,
}: PersonalizationStepProps) {
  const itemsRequiringPersonalization = items.filter((i) => i.requires_personalization);

  if (itemsRequiringPersonalization.length === 0) {
    return (
      <Alert severity="info">
        Среди ваших товаров нет тех, которым требуется опросник. Можно переходить к следующему шагу.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Alert severity="info" variant="outlined">
        Заполните данные для каждого памятника. Они будут использованы для гравировки. Поля «Имя» и «Фамилия» обязательны, остальное — по желанию (можно прислать менеджеру позже).
      </Alert>

      {itemsRequiringPersonalization.map((item, index) => (
        <PersonalizationCard
          key={item.cart_item_id}
          index={index + 1}
          item={item}
          data={getPersonalization(item.cart_item_id)}
          onChange={(updater) => setPersonalization(item.cart_item_id, updater)}
        />
      ))}
    </Stack>
  );
}

interface PersonalizationCardProps {
  index: number;
  item: CartItem;
  data: PersonalizationData;
  onChange: (updater: (prev: PersonalizationData) => PersonalizationData) => void;
}

function PersonalizationCard({ index, item, data, onChange }: PersonalizationCardProps) {
  const isValid = Boolean(data.first_name.trim() && data.last_name.trim());

  const setField = <K extends keyof PersonalizationData>(field: K, value: PersonalizationData[K]) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
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
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="text.secondary">
            Памятник №{index}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {item.name}
          </Typography>
          <Chip
            size="small"
            label={isValid ? 'Минимальные данные заполнены' : 'Требуется заполнить ФИО'}
            color={isValid ? 'success' : 'warning'}
            variant="outlined"
          />
        </Box>
      </Box>

      <Stack spacing={2}>
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
            label="Дата рождения"
            type="date"
            value={data.birth_date}
            onChange={(e) => setField('birth_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Дата смерти"
            type="date"
            value={data.death_date}
            onChange={(e) => setField('death_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>

        <FormControl fullWidth>
          <InputLabel id={`symbol-label-${item.cart_item_id}`}>Религиозный символ</InputLabel>
          <Select
            labelId={`symbol-label-${item.cart_item_id}`}
            label="Религиозный символ"
            value={data.symbol}
            onChange={(e) => setField('symbol', e.target.value as PersonalizationSymbol)}
          >
            {(Object.entries(SYMBOL_LABELS) as [PersonalizationSymbol, string][]).map(
              ([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>

        <TextField
          label="Эпитафия"
          value={data.epitaph}
          onChange={(e) => setField('epitaph', e.target.value)}
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          helperText="Текст, который будет выгравирован под датами"
        />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Фото для портрета
          </Typography>
          <ImageUpload
            value={data.portrait_photo}
            onChange={(url) => setField('portrait_photo', url)}
            uploadType="portrait"
            previewSize={{ width: 180, height: 220 }}
            maxSize={5}
            helperText="Чёткое фото лица, желательно анфас. Можно прислать позже менеджеру."
          />
        </Box>

        <TextField
          label="Примечания"
          value={data.notes}
          onChange={(e) => setField('notes', e.target.value)}
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          helperText="Любые дополнительные пожелания по этому памятнику"
        />
      </Stack>
    </Paper>
  );
}
