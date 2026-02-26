'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
} from '@mui/material';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, authenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    payment_method: 'OFFLINE' as 'ONLINE' | 'OFFLINE',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_items: orderItems,
          payment_method: formData.payment_method,
          customer_info: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error || 'Ошибка при создании заказа';
        const details = data.details ? ` (${data.details})` : '';
        throw new Error(message + details);
      }

      setOrderId(data.order.id);
      setSuccess(true);
      clearCart();
      router.push(`/order/success?orderId=${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Проверка авторизации
  useEffect(() => {
    if (!authLoading && !authenticated) {
      // Сохраняем URL для возврата после авторизации
      sessionStorage.setItem('returnUrl', '/checkout');
      router.push('/auth');
    }
  }, [authenticated, authLoading, router]);

  // Показываем загрузку пока проверяем авторизацию
  if (authLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Проверка авторизации...
        </Typography>
      </Container>
    );
  }

  // Если не авторизован, показываем сообщение (редирект произойдет через useEffect)
  if (!authenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Для оформления заказа необходимо авторизоваться
        </Alert>
        <Button
          component={Link}
          href="/auth"
          variant="contained"
          sx={{
            backgroundColor: '#333',
            '&:hover': { backgroundColor: '#555' },
          }}
        >
          Войти
        </Button>
      </Container>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Ваша корзина пуста
        </Alert>
        <Button
          component={Link}
          href="/catalog"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Вернуться в каталог
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Оформление заказа
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Order Form */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Контактная информация
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Alert severity="info" sx={{ mb: 3 }}>
              После оформления заказа с вами свяжется менеджер для уточнения деталей и способа оплаты.
            </Alert>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Имя"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Фамилия"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                    fullWidth
                  />
                </Box>

                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  label="Телефон"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  fullWidth
                />

                <FormControl component="fieldset" sx={{ mt: 1 }}>
                  <FormLabel component="legend">Оплата</FormLabel>
                  <Typography variant="body1" color="text.secondary">
                    Способ оплаты уточнит менеджер при связи.
                  </Typography>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#333',
                    '&:hover': { backgroundColor: '#555' },
                    mt: 2,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Оформить заказ'
                  )}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Box>

        {/* Order Summary */}
        <Box sx={{ width: { xs: '100%', lg: 400 } }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Ваш заказ
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
              {items.map((item) => {
                const price = item.discounted_price || item.price;
                const total = price * item.quantity;

                return (
                  <Box key={item.product_id} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        position: 'relative',
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Нет фото
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.quantity} × {price.toLocaleString('ru-RU')} BYN
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {total.toLocaleString('ru-RU')} BYN
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Итого:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {totalPrice.toLocaleString('ru-RU')} BYN
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
