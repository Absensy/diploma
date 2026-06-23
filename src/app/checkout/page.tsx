'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/components/GlobalAlert/GlobalAlert';
import { useCheckoutState } from './_state/useCheckoutState';
import { getContactErrors } from './_validation';
import {
  AdditionalServiceDTO,
  emptyContact,
} from './_types';
import PersonalizationStep from './_components/PersonalizationStep';
import ServicesStep from './_components/ServicesStep';
import DeliveryStep from './_components/DeliveryStep';
import ContactStep from './_components/ContactStep';
import ReviewStep from './_components/ReviewStep';

type StepKey = 'personalization' | 'services' | 'delivery' | 'contact' | 'review';

interface StepDef {
  key: StepKey;
  label: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, isHydrated: cartHydrated, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess } = useAlert();

  const activeCartItemIds = useMemo(() => items.map((i) => i.cart_item_id), [items]);
  const checkout = useCheckoutState(activeCartItemIds);
  const {
    state: checkoutState,
    isHydrated: checkoutHydrated,
    getPersonalization,
    setPersonalization,
    toggleService,
    setServiceQuantity,
    setDelivery,
    setContact,
    reset: resetCheckout,
  } = checkout;

  const [services, setServices] = useState<AdditionalServiceDTO[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsPersonalization = items.some((i) => i.requires_personalization);

  const steps = useMemo<StepDef[]>(() => {
    const list: StepDef[] = [];
    if (needsPersonalization) list.push({ key: 'personalization', label: 'Опросник' });
    list.push({ key: 'services', label: 'Доп. услуги' });
    list.push({ key: 'delivery', label: 'Доставка' });
    list.push({ key: 'contact', label: 'Контакты' });
    list.push({ key: 'review', label: 'Подтверждение' });
    return list;
  }, [needsPersonalization]);

  const currentStep = steps[activeStep];

  // Загрузка списка доп. услуг
  useEffect(() => {
    let cancelled = false;
    setServicesLoading(true);
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setServices(Array.isArray(data?.services) ? data.services : []);
      })
      .catch((err) => console.error('Failed to load services:', err))
      .finally(() => !cancelled && setServicesLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Префилл контактов из авторизации
  useEffect(() => {
    if (!user) return;
    setContact((prev) => {
      if (prev.first_name || prev.last_name || prev.phone) return prev;
      return {
        ...emptyContact(),
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        preferred_contact: prev.preferred_contact,
      };
    });
  }, [user, setContact]);

  // Если activeStep уехал за границы (например, удалили все товары с персонализацией) — сброс
  useEffect(() => {
    if (activeStep >= steps.length) setActiveStep(steps.length - 1);
  }, [activeStep, steps.length]);

  const totalServicesPrice = useMemo(() => {
    return checkoutState.services.reduce((sum, sel) => {
      const svc = services.find((s) => s.id === sel.service_id);
      return svc ? sum + svc.price * sel.quantity : sum;
    }, 0);
  }, [checkoutState.services, services]);

  const grandTotal = totalPrice + totalServicesPrice;

  // ────── Валидация шагов ──────
  const isStepValid = useMemo((): boolean => {
    if (!currentStep) return false;
    switch (currentStep.key) {
      case 'personalization': {
        return items
          .filter((i) => i.requires_personalization)
          .every((i) => {
            const p = checkoutState.personalizations[i.cart_item_id];
            return Boolean(p && p.first_name.trim() && p.last_name.trim());
          });
      }
      case 'services':
        return true;
      case 'delivery': {
        const d = checkoutState.delivery;
        return Boolean(d.cemetery_address.trim() && d.contact_phone.trim());
      }
      case 'contact':
        return Object.keys(getContactErrors(checkoutState.contact)).length === 0;
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, items, checkoutState]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((s) => s - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        order_items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          personalization: i.requires_personalization
            ? checkoutState.personalizations[i.cart_item_id]
            : null,
        })),
        services: checkoutState.services,
        delivery: checkoutState.delivery.cemetery_address ? checkoutState.delivery : null,
        contact: {
          first_name: checkoutState.contact.first_name,
          last_name: checkoutState.contact.last_name,
          patronymic: checkoutState.contact.patronymic || null,
          phone: checkoutState.contact.phone,
          email: checkoutState.contact.email || null,
          address: checkoutState.contact.address || null,
          passport_series: checkoutState.contact.passport_series || null,
          passport_number: checkoutState.contact.passport_number || null,
          passport_issued_by: checkoutState.contact.passport_issued_by || null,
          passport_issued_at: checkoutState.contact.passport_issued_at || null,
          personal_number: checkoutState.contact.personal_number || null,
          preferred_contact: checkoutState.contact.preferred_contact || null,
          comment: checkoutState.contact.comment || null,
        },
        payment_method: checkoutState.payment_method,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось оформить заказ');
      }

      clearCart();
      resetCheckout();
      showSuccess(
        `Номер заказа: ${data.order.order_number}. С вами свяжется менеджер.`,
        6000,
        'Спасибо за заказ!',
      );
      router.push(`/order/success?orderNumber=${data.order.order_number}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  // ────── Рендер ранних состояний ──────
  if (!cartHydrated || !checkoutHydrated) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Ваша корзина пуста
        </Alert>
        <Button component={Link} href="/catalog" startIcon={<ArrowBack />} variant="outlined">
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

      <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 4 }}>
        {steps.map((s) => (
          <Step key={s.key}>
            <StepLabel>{s.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Step content */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, minHeight: 360 }}>
            {currentStep.key === 'personalization' && (
              <PersonalizationStep
                items={items}
                getPersonalization={getPersonalization}
                setPersonalization={setPersonalization}
              />
            )}
            {currentStep.key === 'services' && (
              <ServicesStep
                services={services}
                loading={servicesLoading}
                selected={checkoutState.services}
                onToggle={toggleService}
                onQuantityChange={setServiceQuantity}
              />
            )}
            {currentStep.key === 'delivery' && (
              <DeliveryStep
                data={checkoutState.delivery}
                onChange={setDelivery}
              />
            )}
            {currentStep.key === 'contact' && (
              <ContactStep
                data={checkoutState.contact}
                onChange={setContact}
              />
            )}
            {currentStep.key === 'review' && (
              <ReviewStep
                items={items}
                services={services}
                state={checkoutState}
              />
            )}
          </Paper>

          {/* Навигация */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={activeStep === 0 || submitting}
            >
              Назад
            </Button>

            {currentStep.key === 'review' ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!isStepValid || submitting}
                sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#555' } }}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : 'Оформить заказ'}
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                disabled={!isStepValid || submitting}
                sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#555' } }}
              >
                Далее
              </Button>
            )}
          </Box>
        </Box>

        {/* Order summary sidebar */}
        <Box sx={{ width: { xs: '100%', lg: 360 } }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Ваш заказ
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2} sx={{ mb: 2 }}>
              {items.map((item) => {
                const price = item.discounted_price ?? item.price;
                return (
                  <Box key={item.cart_item_id} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        position: 'relative',
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.quantity} × {price.toLocaleString('ru-RU')} BYN
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
              <Row label="Товары" value={`${totalPrice.toLocaleString('ru-RU')} BYN`} />
              {totalServicesPrice > 0 && (
                <Row label="Услуги" value={`${totalServicesPrice.toLocaleString('ru-RU')} BYN`} />
              )}
              <Divider />
              <Row label="Итого" value={`${grandTotal.toLocaleString('ru-RU')} BYN`} bold />
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant={bold ? 'h6' : 'body2'} color={bold ? 'text.primary' : 'text.secondary'}>
        {label}
      </Typography>
      <Typography variant={bold ? 'h6' : 'body2'} fontWeight={bold ? 'bold' : 'normal'}>
        {value}
      </Typography>
    </Box>
  );
}

