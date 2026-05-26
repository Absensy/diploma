'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { type AlertColor } from '@mui/material';
import { ToastStack } from './GlobalAlert.styles';
import Toast from './Toast';

export interface AlertItem {
  id: string;
  message: string;
  title?: string;
  severity: AlertColor;
  duration: number;
  action?: { label: string; onClick: () => void };
}

interface AlertContextType {
  showAlert: (message: string, severity?: AlertColor, duration?: number, title?: string) => void;
  showSuccess: (message: string, duration?: number, title?: string) => void;
  showError: (message: string, duration?: number, title?: string) => void;
  showWarning: (message: string, duration?: number, title?: string) => void;
  showInfo: (message: string, duration?: number, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within an AlertProvider');
  return ctx;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const addAlert = useCallback((
    message: string,
    severity: AlertColor = 'info',
    duration = 4500,
    title?: string,
  ) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setAlerts(prev => [...prev, { id, message, title, severity, duration }]);
    setTimeout(() => removeAlert(id), duration);
  }, [removeAlert]);

  const noop = useCallback((_id: string) => {}, []);

  return (
    <AlertContext.Provider
      value={{
        showAlert: addAlert,
        showSuccess: (msg, dur, title) => addAlert(msg, 'success', dur, title),
        showError:   (msg, dur, title) => addAlert(msg, 'error',   dur, title),
        showWarning: (msg, dur, title) => addAlert(msg, 'warning', dur, title),
        showInfo:    (msg, dur, title) => addAlert(msg, 'info',    dur, title),
      }}
    >
      {children}
      <ToastStack>
        {alerts.map(item => (
          <Toast
            key={item.id}
            item={item}
            onClose={removeAlert}
            onPause={noop}
            onResume={noop}
          />
        ))}
      </ToastStack>
    </AlertContext.Provider>
  );
};
