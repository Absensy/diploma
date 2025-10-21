"use client";

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme/theme';
import { ContactProvider } from '@/contexts/ContactContext';
import { AlertProvider } from '@/components/GlobalAlert/GlobalAlert';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
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


