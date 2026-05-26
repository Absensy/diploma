"use client";

import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from '@/theme/theme';
import { ContactProvider } from '@/contexts/ContactContext';
import { AlertProvider } from '@/components/GlobalAlert/GlobalAlert';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import SnowWrapper from '@/components/SnowWrapper/SnowWrapper';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AlertProvider>
          <AuthProvider>
            <CartProvider>
              <ContactProvider>
                <SnowWrapper />
                {children}
              </ContactProvider>
            </CartProvider>
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}


