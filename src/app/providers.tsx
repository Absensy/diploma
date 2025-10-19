"use client";

import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from '@/theme/theme';
import { ContactProvider } from '@/contexts/ContactContext';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContactProvider>
        {children}
      </ContactProvider>
    </ThemeProvider>
  );
}


