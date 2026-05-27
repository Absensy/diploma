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
import { useAlert } from '@/components/GlobalAlert/GlobalAlert';
import {
  Edit,
  Save,
  Cancel,
  ShoppingBag,
  Person,
  Phone,
  Email,
  CalendarToday,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import OrderStatusStepper from '@/components/OrderStatusStepper';
import {
  ORDER_STATUS_META,
  type OrderStatus,
} from '@/lib/orderStatus';
import { generateReceiptPDF, type ReceiptCompany } from '@/lib/receiptGenerator';

interface Order {
  id: number;
  order_date: string;
  status: OrderStatus;
  confirmed_at?: string | null;
  paid_at?: string | null;
  in_production_at?: string | null;
  in_delivery_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
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
  const { authenticated, loading: authLoading, refreshUser } = useAuth();
  const { showSuccess, showError } = useAlert();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<ReceiptCompany | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.push('/auth');
    }
  }, [authLoading, authenticated, router]);

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
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

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
      showError(message);
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

  const handleEdit = () => setEditing(true);

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
      showError('Имя и фамилия обязательны');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      showError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      showError('Пароли не совпадают');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData: Record<string, unknown> = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim() || null,
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить профиль');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
      setFormData({ ...formData, password: '', confirmPassword: '' });
      await refreshUser();
      showSuccess('Профиль успешно обновлён');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка обновления профиля';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const ensureCompanyInfo = async (): Promise<ReceiptCompany> => {
    if (companyInfo) return companyInfo;
    const res = await fetch('/api/contact');
    if (!res.ok) throw new Error('Не удалось получить реквизиты компании');
    const data = await res.json();
    const info: ReceiptCompany = {
      address: data.address,
      phone: data.phone,
      email: data.email,
      working_hours: data.working_hours,
      instagram: data.instagram ?? null,
    };
    setCompanyInfo(info);
    return info;
  };

  const handleDownloadReceipt = async () => {
    if (!selectedOrder || !profile) return;
    try {
      setDownloadingReceipt(true);
      const company = await ensureCompanyInfo();
      await generateReceiptPDF({
        order: {
          ...selectedOrder,
          user: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            phone: profile.phone,
          },
          order_items: selectedOrder.order_items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            product: item.product ? { id: item.product.id, name: item.product.name } : null,
          })),
        },
        company,
        download: true,
      });
      showSuccess('Чек скачан');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось сгенерировать чек';
      showError(message);
    } finally {
      setDownloadingReceipt(false);
    }
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
                      <Typography variant="caption" color="text.secondary">Имя</Typography>
                      <Typography variant="body1">{profile.first_name}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Person sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Фамилия</Typography>
                      <Typography variant="body1">{profile.last_name}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Email sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{profile.email}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Phone sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Телефон</Typography>
                      <Typography variant="body1">{profile.phone || 'Не указан'}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CalendarToday sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Дата регистрации</Typography>
                      <Typography variant="body1">{formatDate(profile.created_at)}</Typography>
                    </Box>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{ mt: 2, backgroundColor: '#333', '&:hover': { backgroundColor: '#555' } }}
                >
                  Редактировать
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <TextField label="Имя" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} fullWidth required />
                <TextField label="Фамилия" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} fullWidth required />
                <TextField label="Телефон" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} fullWidth />
                <TextField label="Новый пароль (оставьте пустым, если не хотите менять)" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} fullWidth />
                {formData.password && (
                  <TextField label="Подтвердите новый пароль" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} fullWidth />
                )}
                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel} disabled={saving}>Отмена</Button>
                  <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#555' } }}>
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Box>
        </TabPanel>

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
              <Button variant="contained" href="/catalog" sx={{ mt: 2, backgroundColor: '#333', '&:hover': { backgroundColor: '#555' } }}>
                Перейти в каталог
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {orders.map((order) => {
                const meta = ORDER_STATUS_META[order.status];
                const StatusIcon = meta?.icon;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        borderTop: meta ? `4px solid ${meta.hex}` : undefined,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleOrderClick(order)}
                    >
                      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Stack spacing={2} sx={{ flex: 1 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight="600">
                              Заказ #{order.id}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {formatDate(order.order_date)}
                            </Typography>
                          </Box>

                          <Divider />

                          {/* Текущий статус — один кружок */}
                          {order.status === 'CANCELLED' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                              <Box
                                sx={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: '50%',
                                  flexShrink: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                                  color: '#fff',
                                  boxShadow: '0 4px 14px 0 rgba(211,47,47,0.35)',
                                }}
                              >
                                {StatusIcon && <StatusIcon sx={{ fontSize: 26 }} />}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={700} color="error.main">
                                  Заказ отменён
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {meta?.description}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 1.5,
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 64,
                                  height: 64,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: meta ? `linear-gradient(135deg, ${meta.hex} 0%, ${meta.hex}cc 100%)` : '#e0e0e0',
                                  color: '#fff',
                                  boxShadow: meta ? `0 6px 18px 0 ${meta.hex}44` : 'none',
                                  outline: meta ? `3px solid ${meta.hex}33` : 'none',
                                  outlineOffset: 3,
                                }}
                              >
                                {StatusIcon && <StatusIcon sx={{ fontSize: 32 }} />}
                              </Box>
                              <Typography variant="body2" fontWeight={700} sx={{ color: meta?.hex }}>
                                {meta?.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ px: 1, lineHeight: 1.4 }}>
                                {meta?.description}
                              </Typography>
                            </Box>
                          )}

                          <Divider />

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Товаров: {order.order_items.length}
                            </Typography>
                            <Chip
                              label={paymentMethodLabels[order.payment_method]}
                              size="small"
                              variant="outlined"
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight="700">
                              {order.total_amount ? `${order.total_amount.toFixed(2)} BYN` : 'Н/Д'}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                              Нажмите для деталей
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      <Dialog open={orderDialogOpen} onClose={() => setOrderDialogOpen(false)} maxWidth="md" fullWidth>
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
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                  Статус заказа
                </Typography>
                <OrderStatusStepper
                  status={selectedOrder.status}
                  timestamps={selectedOrder}
                  orientation="horizontal"
                />
                {ORDER_STATUS_META[selectedOrder.status]?.description && selectedOrder.status !== 'CANCELLED' && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      bgcolor: `${ORDER_STATUS_META[selectedOrder.status].hex}10`,
                      color: ORDER_STATUS_META[selectedOrder.status].hex,
                      borderLeft: `3px solid ${ORDER_STATUS_META[selectedOrder.status].hex}`,
                    }}
                  >
                    {ORDER_STATUS_META[selectedOrder.status].description}
                  </Typography>
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">Дата заказа</Typography>
                <Typography variant="body1">{formatDate(selectedOrder.order_date)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Способ оплаты</Typography>
                <Typography variant="body1">{paymentMethodLabels[selectedOrder.payment_method]}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>Товары в заказе</Typography>
                <Stack spacing={2} mt={2}>
                  {selectedOrder.order_items.map((item) => (
                    <Box key={item.id} display="flex" gap={2}>
                      <Box sx={{ width: 80, height: 80, position: 'relative', borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight="600">{item.product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Количество: {item.quantity}</Typography>
                        <Typography variant="body2" color="text.secondary">Цена: {item.price_at_purchase.toFixed(2)} BYN</Typography>
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
        <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 1, p: { xs: 2, md: 2 } }}>
          <Button
            onClick={handleDownloadReceipt}
            variant="contained"
            startIcon={downloadingReceipt ? <CircularProgress size={18} color="inherit" /> : <ReceiptIcon />}
            disabled={downloadingReceipt || !selectedOrder}
            sx={{
              backgroundColor: '#333',
              '&:hover': { backgroundColor: '#555' },
              width: { xs: '100%', sm: 'auto' },
              order: { xs: 0, sm: 1 },
            }}
          >
            {downloadingReceipt ? 'Генерация...' : 'Скачать чек (PDF)'}
          </Button>
          <Button
            onClick={() => setOrderDialogOpen(false)}
            sx={{ width: { xs: '100%', sm: 'auto' }, order: { xs: 1, sm: 0 } }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}
