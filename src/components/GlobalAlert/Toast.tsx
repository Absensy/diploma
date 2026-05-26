'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { type AlertColor } from '@mui/material';
import { ToastRoot, ToastIconWrap, ToastProgress } from './GlobalAlert.styles';
import type { AlertItem } from './GlobalAlert';

interface ToastProps {
  item: AlertItem;
  onClose: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

const ICONS: Record<AlertColor, React.ElementType> = {
  success: CheckCircleRoundedIcon,
  error: ErrorRoundedIcon,
  warning: WarningAmberRoundedIcon,
  info: InfoRoundedIcon,
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({ item, onClose, onPause, onResume }, ref) => {
  const Icon = ICONS[item.severity];
  const [paused, setPaused] = useState(false);
  const startRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (!paused) {
        const now = Date.now();
        const total = elapsedRef.current + (now - startRef.current);
        const ratio = Math.max(0, 1 - total / item.duration);
        setProgress(ratio * 100);
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [paused, item.duration]);

  const handleMouseEnter = () => {
    if (paused) return;
    elapsedRef.current += Date.now() - startRef.current;
    setPaused(true);
    onPause(item.id);
  };

  const handleMouseLeave = () => {
    if (!paused) return;
    startRef.current = Date.now();
    setPaused(false);
    onResume(item.id);
  };

  return (
    <ToastRoot
      ref={ref}
      role="alert"
      severity={item.severity}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
    >
      <ToastIconWrap severity={item.severity}>
        <Icon fontSize="small" />
      </ToastIconWrap>
      <Box flex={1} minWidth={0}>
        {item.title && (
          <Typography
            component="div"
            fontSize="15px"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 0.25, lineHeight: 1.3 }}
          >
            {item.title}
          </Typography>
        )}
        <Typography
          component="div"
          fontSize="14px"
          color="text.secondary"
          sx={{ lineHeight: 1.45, wordBreak: 'break-word' }}
        >
          {item.message}
        </Typography>
        {item.action && (
          <Button
            size="small"
            onClick={() => {
              item.action?.onClick();
              onClose(item.id);
            }}
            sx={{
              mt: 1,
              p: '4px 10px',
              minWidth: 0,
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: 'text.primary',
              backgroundColor: 'rgba(0,0,0,0.04)',
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' },
            }}
          >
            {item.action.label}
          </Button>
        )}
      </Box>
      <IconButton
        size="small"
        onClick={() => onClose(item.id)}
        aria-label="Закрыть уведомление"
        sx={{
          color: 'text.secondary',
          width: 28,
          height: 28,
          alignSelf: 'flex-start',
          mt: '-2px',
          mr: '-4px',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)' },
        }}
      >
        <CloseRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <ToastProgress severity={item.severity} style={{ width: `${progress}%` }} />
    </ToastRoot>
  );
});

Toast.displayName = 'Toast';

export default Toast;
