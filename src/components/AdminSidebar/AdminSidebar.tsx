'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  Article,
  Inventory,
  Category,
  ContactPhone,
  ExitToApp,
  Menu,
  Home
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import LogoGranitPrimary1Icon from '@/icons/LogoGranitPrimary1';

interface AdminSidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Контент', icon: <Article />, path: '/admin/content' },
  { text: 'Товары', icon: <Inventory />, path: '/admin/products' },
  { text: 'Категории', icon: <Category />, path: '/admin/categories' },
  { text: 'Контакты', icon: <ContactPhone />, path: '/admin/contacts' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  const handleBackToSite = () => {
    router.push('/');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LogoGranitPrimary1Icon />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
          Админ-панель
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={pathname === item.path}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: '#333',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#555',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: pathname === item.path ? 'white' : '#666',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer actions */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleBackToSite} sx={{ mx: 1, borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40, color: '#666' }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="На сайт" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: 1, color: '#d32f2f' }}>
            <ListItemIcon sx={{ minWidth: 40, color: '#d32f2f' }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile header with menu button */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            backgroundColor: 'white',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            p: { xs: 1.5, sm: 2 },
            gap: 1,
            height: '80px',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <Menu />
          </IconButton>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            '& svg': {
              width: { xs: 42, sm: 32 },
              height: { xs: 42, sm: 32 }
            }
          }}>
            <LogoGranitPrimary1Icon />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#333',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Админ-панель
          </Typography>
        </Box>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default AdminSidebar;