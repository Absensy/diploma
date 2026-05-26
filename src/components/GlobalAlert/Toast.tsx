'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { type AlertColor } from '@mui/material';
import { ToastRoot, ToastIconWrap, ToastProgress, SEVERITY_CONFIG } from './GlobalAlert.styles';
import type { AlertItem } from './GlobalAlert';

interface ToastProps {
  item: AlertItem;
  onClose: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

const ICONS: Record<AlertColor, React.ElementType> = {
  success: CheckCircleRoundedIcon,
  error:   ErrorRoundedIcon,
  warning: WarningAmberRoundedIcon,
  info:    InfoRoundedIcon,
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ item, onClose, onPause, onResume }, ref) => {
    const Icon = ICONS[item.severity];
    const cfg  = SEVERITY_CONFIG[item.severity];

    const [paused, setPaused]     = useState(false);
    const [progress, setProgress] = useState(100);
    const startRef   = useRef(Date.now());
    const elapsedRef = useRef(0);

    useEffect(() => {
      let raf: number;
      const tick = () => {
        if (!paused) {
          const total = elapsedRef.current + (Date.now() - startRef.current);
          setProgress(Math.max(0, (1 - total / item.duration) * 100));
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [paused, item.duration]);

    const handleEnter = () => {
      if (paused) return;
      elapsedRef.current += Date.now() - startRef.current;
      setPaused(true);
      onPause(item.id);
    };
    const handleLeave = () => {
      if (!paused) return;
      startRef.current = Date.now();
      setPaused(false);
      onResume(item.id);
    };

    const title = item.title ?? cfg.label;

    return (
      <ToastRoot
        ref={ref}
        role="alert"
        severity={item.severity}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        tabIndex={0}
      >
        <ToastIconWrap severity={item.severity}>
          <Icon sx={{ fontSize: 20, color: '#fff' }} />
        </ToastIconWrap>

        <Box flex={1} minWidth={0}>
          <Typography
            component="div"
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#f4f4f5',
              lineHeight: 1.3,
              mb: item.message ? 0.5 : 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </Typography>

          {item.message && (
            <Typography
              component="div"
              sx={{
                fontSize: '13px',
                color: 'rgba(244,244,245,0.65)',
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}
            >
              {item.message}
            </Typography>
          )}

          {item.action && (
            <Button
              size="small"
              onClick={() => {
                item.action!.onClick();
                onClose(item.id);
              }}
              sx={{
                mt: 1.25,
                px: '12px',
                py: '4px',
                minWidth: 0,
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 600,
                color: cfg.accent,
                background: `${cfg.iconBg}`,
                borderRadius: '8px',
                border: `1px solid ${cfg.accent}30`,
                '&:hover': {
                  background: `${cfg.iconBg}`,
                  opacity: 0.85,
                },
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
            color: 'rgba(244,244,245,0.4)',
            width: 26,
            height: 26,
            flexShrink: 0,
            alignSelf: 'flex-start',
            mt: '-2px',
            mr: '-4px',
            borderRadius: '8px',
            '&:hover': {
              color: 'rgba(244,244,245,0.85)',
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <ToastProgress severity={item.severity} style={{ width: `${progress}%` }} />
      </ToastRoot>
    );
  },
);

Toast.displayName = 'Toast';
export default Toast;
