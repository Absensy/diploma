"use client";

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import theme from '@/theme/theme';
import createEmotionCache from '@/lib/emotion-cache';
import { ContactProvider } from '@/contexts/ContactContext';
import { AlertProvider } from '@/components/GlobalAlert/GlobalAlert';
import SnowWrapper from '@/components/SnowWrapper/SnowWrapper';

type ProvidersProps = {
  children: ReactNode;
};

/**
 * Root Providers Component
 * 
 * Wraps the application with necessary providers:
 * - CacheProvider: Emotion cache for consistent SSR/client style generation
 * - ThemeProvider: MUI theme configuration
 * - CssBaseline: MUI CSS reset
 * - AlertProvider: Global alert/notification system
 * - ContactProvider: Contact information context
 * - SnowWrapper: Seasonal snow effect component
 * 
 * The Emotion cache is created with useMemo to ensure it's only created once
 * and remains consistent between renders, preventing hydration mismatches.
 */
export default function Providers({ children }: ProvidersProps) {
  // Create cache inside component to ensure it's created consistently
  // Using useMemo ensures the cache instance is stable across re-renders
  const emotionCache = useMemo(() => createEmotionCache(), []);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AlertProvider>
          <ContactProvider>
            <SnowWrapper />
            {children}
          </ContactProvider>
        </AlertProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}


