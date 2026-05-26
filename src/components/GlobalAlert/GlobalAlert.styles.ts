'use client';

import { styled } from '@mui/material/styles';
import { Box, type AlertColor } from '@mui/material';

const SEVERITY_COLORS: Record<AlertColor, { accent: string; bg: string }> = {
  success: { accent: '#16a34a', bg: 'rgba(22, 163, 74, 0.10)' },
  error: { accent: '#dc2626', bg: 'rgba(220, 38, 38, 0.10)' },
  warning: { accent: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
  info: { accent: '#2563eb', bg: 'rgba(37, 99, 235, 0.10)' },
};

export const ToastStack = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: theme.zIndex.snackbar + 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  pointerEvents: 'none',
  width: 'min(420px, calc(100vw - 32px))',

  [theme.breakpoints.down('sm')]: {
    bottom: 16,
    right: 16,
    left: 16,
    width: 'auto',
  },

  '& > *': {
    pointerEvents: 'auto',
  },
}));

interface SeverityProp {
  severity: AlertColor;
}

export const ToastRoot = styled(Box, {
  shouldForwardProp: prop => prop !== 'severity',
})<SeverityProp>(({ theme, severity }) => {
  const { accent } = SEVERITY_COLORS[severity];
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    paddingRight: 14,
    background: '#ffffff',
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.06)',
    borderLeft: `3px solid ${accent}`,
    boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.25), 0 4px 12px -4px rgba(15, 23, 42, 0.10)',
    overflow: 'hidden',
    outline: 'none',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    '&:hover, &:focus-visible': {
      transform: 'translateY(-1px)',
      boxShadow: '0 14px 34px -12px rgba(15, 23, 42, 0.28), 0 6px 14px -4px rgba(15, 23, 42, 0.12)',
    },

    [theme.breakpoints.down('sm')]: {
      padding: '12px 14px',
      borderRadius: 12,
    },
  };
});

export const ToastIconWrap = styled(Box, {
  shouldForwardProp: prop => prop !== 'severity',
})<SeverityProp>(({ severity }) => {
  const { accent, bg } = SEVERITY_COLORS[severity];
  return {
    width: 32,
    height: 32,
    flexShrink: 0,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: accent,
    backgroundColor: bg,
  };
});

export const ToastProgress = styled('div', {
  shouldForwardProp: prop => prop !== 'severity',
})<SeverityProp>(({ severity }) => {
  const { accent } = SEVERITY_COLORS[severity];
  return {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 2,
    backgroundColor: accent,
    opacity: 0.65,
    transition: 'width 0.1s linear',
    borderBottomLeftRadius: 14,
  };
});
