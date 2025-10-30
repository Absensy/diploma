"use client";

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'set' | 'js' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme/theme';
import { ContactProvider } from '@/contexts/ContactContext';
import { AlertProvider } from '@/components/GlobalAlert/GlobalAlert';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-D3JDTEHXTJ', { page_path: window.location.pathname });
    }
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <ContactProvider>
          {children}
        </ContactProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}


