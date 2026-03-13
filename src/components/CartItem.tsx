'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const categoryEmoji: Record<string, string> = {
    tees: '👕',
    hoodies: '🧥',
    mugs: '☕',
    stickers: '🎨',
    caps: '🧢',
  };

  return (
    <div className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl p-4 transition-all duration-300 hover:border-neon-pink/30">
      {/* Product image placeholder */}
      <div className="w-20 h-20 bg-dark-surface rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">
          {categoryEmoji[item.product.category] || '📦'}
        </span>
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bungee text-white text-sm truncate">
          {item.product.title}
        </h3>
        <p className="font-space text-gray-500 text-xs mt-1">
          Variant: {item.variant.title}
        </p>
        <p className="font-space text-neon-green font-bold text-sm mt-1">
          ${item.variant.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            updateQuantity(item.product.id, item.variant.id, item.quantity - 1)
          }
          className="w-8 h-8 bg-dark-surface border border-dark-border rounded-lg flex items-center justify-center
            text-gray-400 hover:text-neon-pink hover:border-neon-pink/30 transition-all duration-200"
        >
          −
        </button>
        <span className="font-space text-white text-sm w-8 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() =>
            updateQuantity(item.product.id, item.variant.id, item.quantity + 1)
          }
          className="w-8 h-8 bg-dark-surface border border-dark-border rounded-lg flex items-center justify-center
            text-gray-400 hover:text-neon-green hover:border-neon-green/30 transition-all duration-200"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <div className="text-right min-w-[80px]">
        <p className="font-space text-white font-bold text-sm">
          ${(item.variant.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeItem(item.product.id, item.variant.id)}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200"
        aria-label="Remove item"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
