'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

export interface CartItem {
  cart_item_id: string;
  product_id: number;
  name: string;
  image: string;
  price: number;
  discounted_price?: number | null;
  quantity: number;
  requires_personalization: boolean;
}

export interface AddItemInput {
  id: number;
  name: string;
  image: string;
  price: number;
  discounted_price?: number | null;
  requires_personalization?: boolean;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
  addItem: (product: AddItemInput, quantity?: number) => string;
  removeItem: (cartItemId: string) => void;
  removeAllByProductId: (productId: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemByCartItemId: (cartItemId: string) => CartItem | undefined;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'granit_cart_v2';
const LEGACY_CART_STORAGE_KEY = 'granit_cart';

const generateCartItemId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const migrateLegacyItems = (raw: unknown): CartItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      cart_item_id: typeof item.cart_item_id === 'string' ? item.cart_item_id : generateCartItemId(),
      product_id: Number(item.product_id),
      name: String(item.name ?? ''),
      image: String(item.image ?? ''),
      price: Number(item.price ?? 0),
      discounted_price: item.discounted_price == null ? null : Number(item.discounted_price),
      quantity: Math.max(1, Number(item.quantity ?? 1)),
      requires_personalization:
        typeof item.requires_personalization === 'boolean' ? item.requires_personalization : true,
    }))
    .filter((item) => Number.isFinite(item.product_id) && item.product_id > 0);
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(migrateLegacyItems(JSON.parse(saved)));
      } else {
        const legacy = localStorage.getItem(LEGACY_CART_STORAGE_KEY);
        if (legacy) {
          const migrated = migrateLegacyItems(JSON.parse(legacy));
          setItems(migrated);
          localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((product: AddItemInput, quantity: number = 1): string => {
    const requiresPersonalization = product.requires_personalization ?? true;
    const newCartItemId = generateCartItemId();

    setItems((prev) => {
      if (!requiresPersonalization) {
        const existing = prev.find(
          (item) => item.product_id === product.id && !item.requires_personalization,
        );
        if (existing) {
          return prev.map((item) =>
            item.cart_item_id === existing.cart_item_id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
      }

      return [
        ...prev,
        {
          cart_item_id: newCartItemId,
          product_id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          discounted_price: product.discounted_price ?? null,
          quantity: requiresPersonalization ? 1 : quantity,
          requires_personalization: requiresPersonalization,
        },
      ];
    });

    return newCartItemId;
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
  }, []);

  const removeAllByProductId = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.cart_item_id !== cartItemId) return item;
        if (item.requires_personalization) return item;
        return { ...item, quantity };
      }),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }, []);

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.product_id === productId),
    [items],
  );

  const getItemByCartItemId = useCallback(
    (cartItemId: string) => items.find((item) => item.cart_item_id === cartItemId),
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.discounted_price ?? item.price;
        return sum + price * item.quantity;
      }, 0),
    [items],
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      totalItems,
      totalPrice,
      isHydrated,
      addItem,
      removeItem,
      removeAllByProductId,
      updateQuantity,
      clearCart,
      isInCart,
      getItemByCartItemId,
      isCartOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isHydrated,
      addItem,
      removeItem,
      removeAllByProductId,
      updateQuantity,
      clearCart,
      isInCart,
      getItemByCartItemId,
      isCartOpen,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
