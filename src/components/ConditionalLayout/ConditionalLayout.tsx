'use client';

import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

interface ConditionalLayoutProps {
    children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();
    
    // Use useMemo to determine if it's an admin page - this is consistent between server and client
    const isAdminPage = useMemo(() => {
        return pathname?.startsWith('/admin') || false;
    }, [pathname]);

    // Always render the same structure to avoid hydration mismatch
    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <Box component="main" sx={{ minHeight: '100vh' }}>
                {children}
            </Box>
            <Footer />
        </>
    );
}
