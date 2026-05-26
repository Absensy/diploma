"use client";

import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from '@/theme/theme';
import { ContactProvider } from '@/contexts/ContactContext';
import { AlertProvider } from '@/components/GlobalAlert/GlobalAlert';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider, useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/Cart/CartDrawer';
import SnowWrapper from '@/components/SnowWrapper/SnowWrapper';

type ProvidersProps = {
  children: ReactNode;
};

function CartDrawerPortal() {
  const { isCartOpen, closeCart } = useCart();
  return <CartDrawer open={isCartOpen} onClose={closeCart} />;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AlertProvider>
          <AuthProvider>
            <CartProvider>
              <CartDrawerPortal />
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


