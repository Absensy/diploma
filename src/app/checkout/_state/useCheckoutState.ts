'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckoutState,
  ContactData,
  DeliveryData,
  PersonalizationData,
  SelectedService,
  emptyPersonalization,
  initialCheckoutState,
} from '../_types';

const STORAGE_KEY = 'granit_checkout_v1';

const isBrowser = typeof window !== 'undefined';

function loadFromStorage(): CheckoutState | null {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return { ...initialCheckoutState(), ...parsed };
  } catch (err) {
    console.error('Error reading checkout state from storage:', err);
    return null;
  }
}

function saveToStorage(state: CheckoutState) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving checkout state to storage:', err);
  }
}

export function useCheckoutState(activeCartItemIds: string[]) {
  const [state, setState] = useState<CheckoutState>(initialCheckoutState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) setState(stored);
    setIsHydrated(true);
  }, []);

  // Удаляем персонализации, которые относятся к удалённым из корзины товарам
  useEffect(() => {
    if (!isHydrated) return;
    setState((prev) => {
      const activeSet = new Set(activeCartItemIds);
      const filtered = Object.fromEntries(
        Object.entries(prev.personalizations).filter(([key]) => activeSet.has(key)),
      );
      if (Object.keys(filtered).length === Object.keys(prev.personalizations).length) {
        return prev;
      }
      return { ...prev, personalizations: filtered };
    });
  }, [activeCartItemIds, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(state);
  }, [state, isHydrated]);

  const getPersonalization = useCallback(
    (cartItemId: string): PersonalizationData =>
      state.personalizations[cartItemId] ?? emptyPersonalization(),
    [state.personalizations],
  );

  const setPersonalization = useCallback(
    (cartItemId: string, updater: (prev: PersonalizationData) => PersonalizationData) => {
      setState((prev) => {
        const current = prev.personalizations[cartItemId] ?? emptyPersonalization();
        const next = updater(current);
        if (next === current) return prev;
        return {
          ...prev,
          personalizations: {
            ...prev.personalizations,
            [cartItemId]: next,
          },
        };
      });
    },
    [],
  );

  const setServices = useCallback((services: SelectedService[]) => {
    setState((prev) => (prev.services === services ? prev : { ...prev, services }));
  }, []);

  const toggleService = useCallback((serviceId: number, defaultQuantity = 1) => {
    setState((prev) => {
      const exists = prev.services.find((s) => s.service_id === serviceId);
      if (exists) {
        return {
          ...prev,
          services: prev.services.filter((s) => s.service_id !== serviceId),
        };
      }
      return {
        ...prev,
        services: [...prev.services, { service_id: serviceId, quantity: defaultQuantity }],
      };
    });
  }, []);

  const setServiceQuantity = useCallback((serviceId: number, quantity: number) => {
    const safe = quantity > 0 ? quantity : 1;
    setState((prev) => {
      const existing = prev.services.find((s) => s.service_id === serviceId);
      if (!existing || existing.quantity === safe) return prev;
      return {
        ...prev,
        services: prev.services.map((s) =>
          s.service_id === serviceId ? { ...s, quantity: safe } : s,
        ),
      };
    });
  }, []);

  const setDelivery = useCallback(
    (updater: (prev: DeliveryData) => DeliveryData) =>
      setState((prev) => {
        const next = updater(prev.delivery);
        if (next === prev.delivery) return prev;
        return { ...prev, delivery: next };
      }),
    [],
  );

  const setContact = useCallback(
    (updater: (prev: ContactData) => ContactData) =>
      setState((prev) => {
        const next = updater(prev.contact);
        if (next === prev.contact) return prev;
        return { ...prev, contact: next };
      }),
    [],
  );

  const setPaymentMethod = useCallback((paymentMethod: CheckoutState['payment_method']) => {
    setState((prev) =>
      prev.payment_method === paymentMethod ? prev : { ...prev, payment_method: paymentMethod },
    );
  }, []);

  const reset = useCallback(() => {
    setState(initialCheckoutState());
    if (isBrowser) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    state,
    isHydrated,
    getPersonalization,
    setPersonalization,
    setServices,
    toggleService,
    setServiceQuantity,
    setDelivery,
    setContact,
    setPaymentMethod,
    reset,
  };
}

export type CheckoutStateApi = ReturnType<typeof useCheckoutState>;
