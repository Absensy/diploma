'use client';

import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../AdminSidebar/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          pt: isMobile ? '80px' : 0,
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          ml: { xs: 0, md: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;