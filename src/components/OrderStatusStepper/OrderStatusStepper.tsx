'use client';

import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_META,
  getStatusFlowIndex,
  type OrderStatus,
} from '@/lib/orderStatus';

export interface OrderTimestamps {
  order_date?: string | Date | null;
  paid_at?: string | Date | null;
  in_production_at?: string | Date | null;
  in_delivery_at?: string | Date | null;
  completed_at?: string | Date | null;
  cancelled_at?: string | Date | null;
}

interface OrderStatusStepperProps {
  status: OrderStatus | string;
  timestamps?: OrderTimestamps;
  orientation?: 'horizontal' | 'vertical';
  compact?: boolean;
}

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: 'calc(-50% + 22px)',
    right: 'calc(50% + 22px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #1976d2 0%, #7b1fa2 50%, #2e7d32 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #1976d2 0%, #7b1fa2 50%, #2e7d32 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

interface StepDotProps {
  active: boolean;
  completed: boolean;
  hex: string;
  icon: React.ElementType;
  size?: number;
}

const StepDot = ({ active, completed, hex, icon: Icon, size = 44 }: StepDotProps) => {
  const isReached = active || completed;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isReached
          ? `linear-gradient(135deg, ${hex} 0%, ${hex}dd 100%)`
          : '#e0e0e0',
        color: isReached ? '#fff' : '#9e9e9e',
        boxShadow: isReached
          ? `0 4px 12px 0 ${hex}55`
          : '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        border: active ? `3px solid ${hex}33` : '0 solid transparent',
        outline: active ? `2px solid ${hex}` : 'none',
        outlineOffset: active ? 2 : 0,
      }}
    >
      <Icon sx={{ fontSize: size * 0.5 }} />
    </Box>
  );
};

function formatDateTime(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderStatusStepper({
  status,
  timestamps,
  orientation,
  compact = false,
}: OrderStatusStepperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const effectiveOrientation: 'horizontal' | 'vertical' =
    orientation ?? (isMobile ? 'vertical' : 'horizontal');

  if (status === 'CANCELLED') {
    const meta = ORDER_STATUS_META.CANCELLED;
    const cancelledDate = formatDateTime(timestamps?.cancelled_at);
    const Icon = meta.icon;
    return (
      <Alert
        severity="error"
        icon={<Icon />}
        sx={{
          borderRadius: 2,
          '& .MuiAlert-icon': { alignItems: 'center' },
        }}
      >
        <Typography variant="subtitle2" fontWeight="600">
          Заказ отменён
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {cancelledDate ? `Дата отмены: ${cancelledDate}` : meta.description}
        </Typography>
      </Alert>
    );
  }

  const currentIndex = getStatusFlowIndex(status as OrderStatus);
  const activeStep = currentIndex >= 0 ? currentIndex : 0;
  const stepSize = compact ? 36 : 44;

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={effectiveOrientation === 'horizontal'}
        orientation={effectiveOrientation}
        connector={effectiveOrientation === 'horizontal' ? <ColorConnector /> : undefined}
        sx={{
          '& .MuiStepLabel-label': {
            mt: effectiveOrientation === 'horizontal' ? 1 : 0,
            fontSize: compact ? '0.75rem' : '0.875rem',
            fontWeight: 500,
          },
          '& .MuiStepLabel-label.Mui-active': {
            fontWeight: 700,
          },
        }}
      >
        {ORDER_STATUS_FLOW.map((stepStatus, index) => {
          const meta = ORDER_STATUS_META[stepStatus];
          const completed = index < activeStep;
          const active = index === activeStep;
          const dateValue = timestamps?.[meta.timestampField];
          const dateStr = formatDateTime(dateValue);

          return (
            <Step key={stepStatus} completed={completed}>
              <StepLabel
                StepIconComponent={() => (
                  <StepDot
                    active={active}
                    completed={completed}
                    hex={meta.hex}
                    icon={meta.icon}
                    size={stepSize}
                  />
                )}
              >
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={active ? 700 : 500}
                    sx={{
                      color: active ? meta.hex : completed ? 'text.primary' : 'text.secondary',
                      fontSize: compact ? '0.75rem' : '0.875rem',
                    }}
                  >
                    {meta.shortLabel}
                  </Typography>
                  {dateStr && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        display: 'block',
                        fontSize: compact ? '0.65rem' : '0.7rem',
                        mt: 0.25,
                      }}
                    >
                      {dateStr}
                    </Typography>
                  )}
                </Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
