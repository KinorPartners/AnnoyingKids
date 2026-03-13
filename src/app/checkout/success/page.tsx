'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import NeonButton from '@/components/NeonButton';
import GlitchText from '@/components/GlitchText';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-3xl animate-pulse" />
          <span className="text-8xl relative z-10 inline-block animate-float">🎉</span>
        </div>

        <GlitchText
          text="ORDER CONFIRMED!"
          as="h1"
          className="font-bungee text-3xl sm:text-4xl text-white mb-4"
        />

        <p className="font-space text-gray-400 text-lg mb-3">
          Your chaos is on its way!
        </p>
        <p className="font-space text-gray-500 text-sm mb-10">
          We have received your order and our print-on-demand gremlins are already
          working on it. You will get a shipping confirmation email once your merch
          is dispatched.
        </p>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-10">
          <h3 className="font-bungee text-neon-green text-sm mb-3">What happens next?</h3>
          <ul className="font-space text-gray-400 text-sm space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-neon-green mt-0.5">✓</span>
              <span>Order confirmation sent to your email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-green mt-0.5">✓</span>
              <span>Your merch is printed and quality checked (2-5 business days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-green mt-0.5">✓</span>
              <span>Shipped with tracking to your door</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-green mt-0.5">✓</span>
              <span>You unleash maximum chaos upon delivery</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NeonButton href="/products" variant="pink" size="lg">
            Keep Shopping
          </NeonButton>
          <NeonButton href="/" variant="green" size="lg">
            Back to Home
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
