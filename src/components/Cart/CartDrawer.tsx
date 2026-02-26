'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Stack,
  Paper,
  TextField,
} from '@mui/material';
import {
  Close,
  Delete,
  Add,
  Remove,
  ShoppingCart,
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, totalPrice, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const { authenticated } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    if (authenticated) {
      router.push('/checkout');
    } else {
      // Сохраняем URL для возврата после авторизации
      sessionStorage.setItem('returnUrl', '/checkout');
      router.push('/auth');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 1400, // Выше header (1300)
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          zIndex: 1400,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            Корзина ({totalItems})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Divider />

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                p: 3,
              }}
            >
              <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Корзина пуста
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Добавьте товары в корзину
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {items.map((item) => {
                const price = item.discounted_price || item.price;
                const total = price * item.quantity;

                return (
                  <Paper key={item.product_id} elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Image */}
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
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

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 1,
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {price.toLocaleString('ru-RU')} BYN
                          </Typography>
                          {item.discounted_price && (
                            <Typography
                              variant="caption"
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              {item.price.toLocaleString('ru-RU')} BYN
                            </Typography>
                          )}
                        </Box>

                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            sx={{ border: '1px solid', borderColor: 'divider' }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              updateQuantity(item.product_id, val);
                            }}
                            size="small"
                            type="number"
                            inputProps={{
                              min: 1,
                              style: { textAlign: 'center', width: 50 },
                            }}
                            sx={{ width: 70 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            sx={{ border: '1px solid', borderColor: 'divider' }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeItem(item.product_id)}
                            sx={{ ml: 'auto' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>

                        <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                          Итого: {total.toLocaleString('ru-RU')} BYN
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Итого:</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {totalPrice.toLocaleString('ru-RU')} BYN
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCheckout}
                  sx={{
                    backgroundColor: '#333',
                    '&:hover': { backgroundColor: '#555' },
                  }}
                >
                  Оформить заказ
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={clearCart}
                  color="error"
                >
                  Очистить корзину
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
