'use client';

import React, { useMemo } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import {
  AdditionalServiceDTO,
  SERVICE_CATEGORY_LABELS,
  SERVICE_UNIT_LABELS,
  SelectedService,
  ServiceCategory,
} from '../_types';

interface ServicesStepProps {
  services: AdditionalServiceDTO[];
  loading: boolean;
  selected: SelectedService[];
  onToggle: (serviceId: number, defaultQuantity?: number) => void;
  onQuantityChange: (serviceId: number, quantity: number) => void;
}

export default function ServicesStep({
  services,
  loading,
  selected,
  onToggle,
  onQuantityChange,
}: ServicesStepProps) {
  const grouped = useMemo(() => {
    const map = new Map<ServiceCategory, AdditionalServiceDTO[]>();
    for (const svc of services) {
      const list = map.get(svc.category) ?? [];
      list.push(svc);
      map.set(svc.category, list);
    }
    return map;
  }, [services]);

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (services.length === 0) {
    return (
      <Alert severity="info">
        Список дополнительных услуг пока пуст. Можно переходить к следующему шагу.
      </Alert>
    );
  }

  const selectedMap = new Map(selected.map((s) => [s.service_id, s.quantity]));

  return (
    <Stack spacing={3}>
      <Alert severity="info" variant="outlined">
        Выберите дополнительные услуги. Это не обязательно — установку и доставку можно согласовать с менеджером позже.
      </Alert>

      {Array.from(grouped.entries()).map(([category, list]) => (
        <Box key={category}>
          <Typography variant="overline" color="text.secondary">
            {SERVICE_CATEGORY_LABELS[category]}
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {list.map((svc) => (
              <ServiceRow
                key={svc.id}
                service={svc}
                checked={selectedMap.has(svc.id)}
                quantity={selectedMap.get(svc.id) ?? 1}
                onToggle={() => onToggle(svc.id)}
                onQuantityChange={(q) => onQuantityChange(svc.id, q)}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

interface ServiceRowProps {
  service: AdditionalServiceDTO;
  checked: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
}

function ServiceRow({ service, checked, quantity, onToggle, onQuantityChange }: ServiceRowProps) {
  const showQuantityControl =
    checked && (service.unit === 'PER_SQM' || service.unit === 'PER_METER' || service.unit === 'PER_ITEM');

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Checkbox checked={checked} onChange={onToggle} sx={{ mt: -0.5 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={500}>
            {service.name}
          </Typography>
          {service.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {service.description}
            </Typography>
          )}
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography variant="body1" fontWeight="bold">
            {service.price.toLocaleString('ru-RU')} BYN
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {SERVICE_UNIT_LABELS[service.unit]}
          </Typography>
        </Box>
      </Box>

      {showQuantityControl && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Количество
            </Typography>
            <IconButton
              size="small"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Remove fontSize="small" />
            </IconButton>
            <TextField
              size="small"
              type="number"
              value={quantity}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (Number.isFinite(v)) onQuantityChange(v);
              }}
              inputProps={{ min: 0.1, step: 0.1, style: { textAlign: 'center', width: 60 } }}
              sx={{ width: 80 }}
            />
            <IconButton
              size="small"
              onClick={() => onQuantityChange(quantity + 1)}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Add fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 2, minWidth: 100, textAlign: 'right' }}>
              {(service.price * quantity).toLocaleString('ru-RU')} BYN
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
