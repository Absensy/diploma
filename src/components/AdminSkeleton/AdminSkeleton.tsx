'use client';

import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';

// Скелетон для таблицы товаров
export const AdminProductsTableSkeleton: React.FC = () => {
  return (
    <>
      {/* Controls Skeleton */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          gap={2}
        >
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            flexDirection={{ xs: 'column', sm: 'row' }}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <Skeleton
              variant="rectangular"
              width={{ xs: '100%', sm: 300 }}
              height={40}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Box
            display="flex"
            gap={2}
            flexDirection={{ xs: 'column', sm: 'row' }}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <Skeleton
              variant="rectangular"
              width={{ xs: '100%', sm: 200 }}
              height={36}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={{ xs: '100%', sm: 160 }}
              height={36}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Table Skeleton */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Skeleton variant="rectangular" width={18} height={18} />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell><Skeleton variant="text" width={80} /></TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Skeleton variant="text" width={90} />
              </TableCell>
              <TableCell><Skeleton variant="text" width={60} /></TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                <Skeleton variant="text" width={70} />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell align="center"><Skeleton variant="text" width={80} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} hover>
                <TableCell padding="checkbox" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Skeleton variant="rectangular" width={18} height={18} />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Skeleton variant="rounded" width={50} height={50} />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Skeleton
                      variant="rounded"
                      width={40}
                      height={40}
                      sx={{ display: { xs: 'block', sm: 'none' } }}
                    />
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width="80%" height={20} sx={{ marginBottom: '4px' }} />
                      <Skeleton variant="text" width="60%" height={16} sx={{ marginBottom: '4px' }} />
                      <Skeleton
                        variant="text"
                        width="50%"
                        height={14}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Box>
                    <Skeleton variant="text" width={80} height={20} sx={{ marginBottom: '4px' }} />
                    <Skeleton variant="text" width={60} height={16} />
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={70} height={24} />
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// Скелетон для таблицы категорий
export const AdminCategoriesGridSkeleton: React.FC = () => {
  return (
    <>
      {/* Controls Skeleton */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
      >
        <Skeleton variant="text" width={150} height={24} />
        <Skeleton
          variant="rectangular"
          width={{ xs: '100%', sm: 160 }}
          height={36}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      {/* Grid Skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ position: 'relative' }}>
              <Skeleton variant="rounded" width="100%" height={200} />
              <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Skeleton variant="rounded" width={70} height={24} />
              </Box>
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="80%" height={24} sx={{ marginBottom: '8px' }} />
              <Box sx={{ marginBottom: '16px' }}>
                <Skeleton variant="text" width="60%" height={20} sx={{ marginBottom: '4px' }} />
                <Skeleton variant="text" width="50%" height={16} />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="30%" height={16} />
              </Box>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Box display="flex" gap={1}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
};

// Скелетон для формы товара/категории
export const AdminFormDialogSkeleton: React.FC<{ open: boolean }> = ({ open }) => {
  return (
    <Dialog open={open} maxWidth="lg" fullWidth fullScreen>
      <DialogTitle>
        <Skeleton variant="text" width={200} height={32} />
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} pt={1}>
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />

          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1, flex: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1, flex: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1, flex: 1 }} />
          </Box>

          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1, flex: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1, flex: 1 }} />
          </Box>

          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />

          <Box>
            <Skeleton variant="text" width={200} height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width={200} height={120} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
      </DialogActions>
    </Dialog>
  );
};

// Скелетон для дашборда
export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <>
      {/* Header Skeleton */}
      <Box mb={4}>
        <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={32} />
      </Box>

      {/* Statistics Cards Skeleton */}
      <Grid container spacing={3} mb={4}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{
              height: '100%',
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.2)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                  <Skeleton variant="rounded" width={48} height={48} />
                  <Skeleton variant="rounded" width={60} height={24} />
                </Box>
                <Skeleton variant="text" width={80} height={48} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={100} height={16} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Skeleton variant="text" width={180} height={32} sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="rounded" width={48} height={48} />
                        <Box flex={1}>
                          <Skeleton variant="text" width={140} height={24} sx={{ mb: 0.5 }} />
                          <Skeleton variant="text" width={180} height={16} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Products */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Skeleton variant="text" width={180} height={32} />
              <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
            </Box>
            <Box>
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} sx={{ mb: 2, borderRadius: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="rounded" width={48} height={48} />
                      <Box flex={1}>
                        <Skeleton variant="text" width={200} height={20} sx={{ mb: 1 }} />
                        <Box display="flex" alignItems="center" gap={2}>
                          <Skeleton variant="rounded" width={80} height={20} />
                          <Skeleton variant="text" width={100} height={16} />
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Skeleton variant="text" width={80} height={24} />
                        <Skeleton variant="text" width={60} height={16} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* System Status */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
            <Box>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Skeleton variant="circular" width={8} height={8} />
                    <Skeleton variant="text" width={80} height={16} />
                  </Box>
                  <Skeleton variant="text" width={60} height={16} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

// Скелетон для страницы контактов
export const AdminContactsSkeleton: React.FC = () => {
  return (
    <>
      {/* Header Skeleton */}
      <Box mb={4}>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={24} />
      </Box>

      <Grid container spacing={4}>
        {/* Основная контактная информация */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={180} height={24} />
            </Box>
            <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 3 }} />

            <Box display="flex" flexDirection="column" gap={3}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
              <Box>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={200} height={16} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Режим работы */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={120} height={24} />
            </Box>
            <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 3 }} />

            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Skeleton variant="text" width={150} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={250} height={16} sx={{ mt: 0.5 }} />
              </Box>
              <Box>
                <Skeleton variant="text" width={150} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={250} height={16} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Предварительный просмотр */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width={200} height={24} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 3 }} />

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Skeleton variant="text" width={220} height={20} sx={{ mb: 2 }} />
                <Box sx={{ fontSize: '0.875rem' }}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Skeleton variant="circular" width={16} height={16} />
                      <Skeleton variant="text" width={180} height={16} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Skeleton variant="text" width={120} height={20} sx={{ mb: 2 }} />
                <Box>
                  <Skeleton variant="text" width={160} height={16} />
                  <Skeleton variant="text" width={140} height={16} />
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      {/* Save Button Skeleton */}
      <Box mt={4} display="flex" justifyContent="center">
        <Skeleton variant="rectangular" width={250} height={48} sx={{ borderRadius: 1 }} />
      </Box>
    </>
  );
};

// Скелетон для операций (создание/обновление/удаление)
export const AdminOperationSkeleton: React.FC<{ type: 'create' | 'update' | 'delete' }> = ({ type }) => {
  const messages = {
    create: 'Создание...',
    update: 'Обновление...',
    delete: 'Удаление...'
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      }}
    >
      <Skeleton variant="circular" width={60} height={60} />
      <Skeleton variant="text" width={120} height={24} />
    </Box>
  );
};