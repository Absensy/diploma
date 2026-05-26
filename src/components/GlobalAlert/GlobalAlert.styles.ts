'use client';

import { styled } from '@mui/material/styles';
import { Box, type AlertColor } from '@mui/material';

export const SEVERITY_CONFIG: Record<AlertColor, {
  accent: string;
  gradient: string;
  glow: string;
  iconBg: string;
  label: string;
}> = {
  success: {
    accent:  '#22c55e',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
    glow:    'rgba(34,197,94,0.22)',
    iconBg:  'rgba(34,197,94,0.16)',
    label:   'Успешно',
  },
  error: {
    accent:  '#f43f5e',
    gradient: 'linear-gradient(135deg, #be123c 0%, #f43f5e 100%)',
    glow:    'rgba(244,63,94,0.22)',
    iconBg:  'rgba(244,63,94,0.16)',
    label:   'Ошибка',
  },
  warning: {
    accent:  '#fb923c',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)',
    glow:    'rgba(251,146,60,0.22)',
    iconBg:  'rgba(251,146,60,0.16)',
    label:   'Внимание',
  },
  info: {
    accent:  '#60a5fa',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)',
    glow:    'rgba(96,165,250,0.22)',
    iconBg:  'rgba(96,165,250,0.16)',
    label:   'Инфо',
  },
};

export const ToastStack = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 28,
  right: 28,
  zIndex: theme.zIndex.snackbar + 10,
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: 10,
  pointerEvents: 'none',
  width: 'min(400px, calc(100vw - 32px))',
  '& > *': { pointerEvents: 'auto' },

  [theme.breakpoints.down('sm')]: {
    bottom: 16,
    right: 0,
    left: 0,
    width: '100%',
    padding: '0 12px',
  },
}));

interface SeverityProp { severity: AlertColor }

export const ToastRoot = styled(Box, {
  shouldForwardProp: p => p !== 'severity',
})<SeverityProp>(({ severity }) => {
  const { glow } = SEVERITY_CONFIG[severity];
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '16px 16px 20px 16px',
    background: 'linear-gradient(145deg, #1f1f23 0%, #18181b 100%)',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.09)',
    boxShadow: [
      '0 24px 64px rgba(0,0,0,0.55)',
      '0 8px 24px rgba(0,0,0,0.35)',
      '0 1px 0 rgba(255,255,255,0.07) inset',
      `0 0 0 1px rgba(255,255,255,0.04)`,
      `0 8px 32px ${glow}`,
    ].join(', '),
    overflow: 'hidden',
    outline: 'none',
    animation: 'toastSlideIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover, &:focus-visible': {
      transform: 'translateY(-2px) scale(1.005)',
      boxShadow: [
        '0 28px 72px rgba(0,0,0,0.60)',
        '0 10px 28px rgba(0,0,0,0.40)',
        '0 1px 0 rgba(255,255,255,0.08) inset',
        `0 0 0 1px rgba(255,255,255,0.05)`,
        `0 12px 40px ${glow}`,
      ].join(', '),
    },
    '@keyframes toastSlideIn': {
      from: {
        opacity: 0,
        transform: 'translateX(110%) scale(0.9)',
      },
      to: {
        opacity: 1,
        transform: 'translateX(0) scale(1)',
      },
    },
  };
});

export const ToastIconWrap = styled(Box, {
  shouldForwardProp: p => p !== 'severity',
})<SeverityProp>(({ severity }) => {
  const { gradient, iconBg } = SEVERITY_CONFIG[severity];
  return {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: iconBg,
    backgroundImage: gradient,
    color: '#ffffff',
    boxShadow: `0 4px 14px ${iconBg}`,
    marginTop: 1,
  };
});

export const ToastProgress = styled('div', {
  shouldForwardProp: p => p !== 'severity',
})<SeverityProp>(({ severity }) => {
  const { gradient } = SEVERITY_CONFIG[severity];
  return {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 3,
    backgroundImage: gradient,
    opacity: 0.85,
    transition: 'width 0.08s linear',
    borderRadius: '0 3px 0 18px',
  };
});
