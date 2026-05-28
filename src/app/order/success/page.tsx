'use client';

import React, { Suspense } from 'react';
import { Container, Paper, Typography, Button, Stack } from '@mui/material';
import { ShoppingCart, List } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') ?? searchParams.get('orderId');

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
          Спасибо за заказ!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
          С вами свяжется менеджер для уточнения деталей и способа оплаты.
        </Typography>
        {orderNumber && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Номер заказа: <strong>{orderNumber}</strong>
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
          Сохраните номер — по нему мы найдём ваш заказ при обращении.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Button
            component={Link}
            href="/catalog"
            variant="outlined"
            startIcon={<ShoppingCart />}
          >
            Продолжить покупки
          </Button>
          <Button
            component={Link}
            href="/profile"
            variant="contained"
            startIcon={<List />}
            sx={{
              backgroundColor: '#333',
              '&:hover': { backgroundColor: '#555' },
            }}
          >
            Мои заказы
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<Container sx={{ py: 6, textAlign: 'center' }}>Загрузка...</Container>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
