'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const existingIndex = state.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...state];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...state, { product, variant, quantity }];
    }

    case 'REMOVE_ITEM': {
      return state.filter(
        (item) =>
          !(item.product.id === action.payload.productId && item.variant.id === action.payload.variantId)
      );
    }

    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter(
          (item) => !(item.product.id === productId && item.variant.id === variantId)
        );
      }
      return state.map((item) =>
        item.product.id === productId && item.variant.id === variantId
          ? { ...item, quantity }
          : item
      );
    }

    case 'CLEAR_CART':
      return [];

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'annoyingkids-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'LOAD_CART', payload: parsed });
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = useCallback(
    (product: Product, variant: ProductVariant, quantity: number = 1) => {
      dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    },
    []
  );

  const removeItem = useCallback((productId: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
