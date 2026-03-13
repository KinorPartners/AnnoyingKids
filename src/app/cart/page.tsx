'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItemComponent from '@/components/CartItem';
import NeonButton from '@/components/NeonButton';
import GlitchText from '@/components/GlitchText';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            title: item.product.title,
            variantTitle: item.variant.title,
            price: item.variant.price,
            quantity: item.quantity,
            image: item.product.images[0] || '',
          })),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert('Checkout error: ' + data.error);
      }
    } catch (error) {
      alert(
        'Unable to start checkout. Make sure Stripe is configured. Check console for details.'
      );
      console.error('Checkout error:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 inline-block animate-float">🛒</span>
          <h1 className="font-bungee text-3xl text-white mb-4">Your Cart is Empty</h1>
          <p className="font-space text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t unleashed any chaos yet. Time to fix that.
          </p>
          <NeonButton href="/products" variant="pink" size="lg">
            Start Shopping
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <GlitchText
            text="YOUR CART"
            as="h1"
            className="font-bungee text-3xl sm:text-4xl text-white"
          />
          <p className="font-space text-gray-500 mt-2">
            {totalItems} item{totalItems !== 1 ? 's' : ''} ready to cause chaos
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {items.map((item) => (
            <CartItemComponent
              key={item.product.id + '-' + item.variant.id}
              item={item}
            />
          ))}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8">
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between font-space text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-white">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between font-space text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-neon-green">Calculated at checkout</span>
            </div>
            <div className="h-px bg-dark-border my-4" />
            <div className="flex items-center justify-between">
              <span className="font-bungee text-lg text-white">Total</span>
              <span className="font-bungee text-2xl text-neon-green">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCheckout}
              className="flex-1 px-8 py-4 bg-neon-pink text-white font-bungee text-lg uppercase rounded-lg shadow-[0_0_20px_rgba(255,45,120,0.5)] hover:shadow-[0_0_30px_rgba(255,45,120,0.8)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="px-6 py-4 bg-dark-surface border border-dark-border rounded-lg font-space text-gray-500 text-sm uppercase tracking-wider hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
            >
              Clear Cart
            </button>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/products"
              className="font-space text-gray-500 text-sm hover:text-neon-pink transition-colors duration-300 inline-flex items-center gap-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
