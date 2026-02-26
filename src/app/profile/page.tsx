'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  ShoppingBag,
  Person,
  Phone,
  Email,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Order {
  id: number;
  order_date: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'OFFLINE';
  total_amount: number | null;
  payment_method: 'ONLINE' | 'OFFLINE';
  order_items: Array<{
    id: number;
    quantity: number;
    price_at_purchase: number;
    product: {
      id: number;
      name: string;
      image: string;
      price: number;
      discounted_price: number | null;
    };
  }>;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  PENDING: 'Ожидает',
  PAID: 'Оплачен',
  SHIPPED: 'Отправлен',
  COMPLETED: 'Завершен',
  OFFLINE: 'Офлайн',
};

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PAID: 'info',
  SHIPPED: 'primary',
  COMPLETED: 'success',
  OFFLINE: 'default',
};

const paymentMethodLabels: Record<string, string> = {
  ONLINE: 'Онлайн',
  OFFLINE: 'Офлайн',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { user: authUser, authenticated, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Редирект если не авторизован
  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.push('/auth');
    }
  }, [authLoading, authenticated, router]);

  // Загрузка профиля
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth');
          return;
        }
        throw new Error('Не удалось загрузить профиль');
      }
      const data = await response.json();
      setProfile(data);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки профиля';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Загрузка заказов
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch('/api/user/orders');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth');
          return;
        }
        throw new Error('Не удалось загрузить заказы');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки заказов';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setOrdersLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (authenticated) {
      fetchProfile();
      fetchOrders();
    }
  }, [authenticated, fetchProfile, fetchOrders]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 1 && orders.length === 0) {
      fetchOrders();
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone || '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  const handleSave = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setSnackbar({ open: true, message: 'Имя и фамилия обязательны', severity: 'error' });
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setSnackbar({ open: true, message: 'Пароль должен содержать минимум 6 символов', severity: 'error' });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setSnackbar({ open: true, message: 'Пароли не совпадают', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim() || null,
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить профиль');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
      await refreshUser();
      setSnackbar({ open: true, message: 'Профиль успешно обновлен', severity: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка обновления профиля';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated || !profile) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Мой профиль
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Управление личными данными и просмотр заказов
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Person />} iconPosition="start" label="Личные данные" />
          <Tab icon={<ShoppingBag />} iconPosition="start" label="Мои заказы" />
        </Tabs>

        {/* Вкладка личных данных */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ maxWidth: 600 }}>
            {!editing ? (
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: '#333', fontSize: '1.5rem' }}>
                    <Person sx={{ color: 'white', fontSize: 36 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="600">
                      {profile.first_name} {profile.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Person sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Имя
                      </Typography>
                      <Typography variant="body1">{profile.first_name}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Person sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Фамилия
                      </Typography>
                      <Typography variant="body1">{profile.last_name}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Email sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{profile.email}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Phone sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Телефон
                      </Typography>
                      <Typography variant="body1">{profile.phone || 'Не указан'}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <CalendarToday sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Дата регистрации
                      </Typography>
                      <Typography variant="body1">{formatDate(profile.created_at)}</Typography>
                    </Box>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{
                    mt: 2,
                    backgroundColor: '#333',
                    '&:hover': { backgroundColor: '#555' },
                  }}
                >
                  Редактировать
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <TextField
                  label="Имя"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Фамилия"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Новый пароль (оставьте пустым, если не хотите менять)"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  fullWidth
                />
                {formData.password && (
                  <TextField
                    label="Подтвердите новый пароль"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    fullWidth
                  />
                )}
                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                      backgroundColor: '#333',
                      '&:hover': { backgroundColor: '#555' },
                    }}
                  >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Box>
        </TabPanel>

        {/* Вкладка заказов */}
        <TabPanel value={tabValue} index={1}>
          {ordersLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : orders.length === 0 ? (
            <Box textAlign="center" p={4}>
              <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                У вас пока нет заказов
              </Typography>
              <Button
                variant="contained"
                href="/catalog"
                sx={{
                  mt: 2,
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#555' },
                }}
              >
                Перейти в каталог
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleOrderClick(order)}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight="600">
                            Заказ #{order.id}
                          </Typography>
                          <Chip
                            label={statusLabels[order.status]}
                            color={statusColors[order.status]}
                            size="small"
                          />
                        </Box>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                          Дата: {formatDate(order.order_date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Товаров: {order.order_items.length}
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                          {order.total_amount ? `${order.total_amount.toFixed(2)} BYN` : 'Н/Д'}
                        </Typography>
                        <Chip
                          label={paymentMethodLabels[order.payment_method]}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Диалог деталей заказа */}
      <Dialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Заказ #{selectedOrder?.id}</Typography>
            <IconButton onClick={() => setOrderDialogOpen(false)} size="small">
              <Cancel />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Дата заказа
                </Typography>
                <Typography variant="body1">{formatDate(selectedOrder.order_date)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Статус
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={statusLabels[selectedOrder.status]}
                    color={statusColors[selectedOrder.status]}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Способ оплаты
                </Typography>
                <Typography variant="body1">{paymentMethodLabels[selectedOrder.payment_method]}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Товары в заказе
                </Typography>
                <Stack spacing={2} mt={2}>
                  {selectedOrder.order_items.map((item) => (
                    <Box key={item.id} display="flex" gap={2}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          position: 'relative',
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight="600">
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Количество: {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Цена: {item.price_at_purchase.toFixed(2)} BYN
                        </Typography>
                        <Typography variant="body1" fontWeight="600" mt={1}>
                          Итого: {(item.price_at_purchase * item.quantity).toFixed(2)} BYN
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Общая сумма:</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {selectedOrder.total_amount ? `${selectedOrder.total_amount.toFixed(2)} BYN` : 'Н/Д'}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
