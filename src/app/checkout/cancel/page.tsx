import React from 'react';
import NeonButton from '@/components/NeonButton';
import GlitchText from '@/components/GlitchText';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-neon-yellow/20 rounded-full blur-3xl animate-pulse" />
          <span className="text-8xl relative z-10 inline-block animate-float">😅</span>
        </div>

        <GlitchText
          text="CHECKOUT CANCELLED"
          as="h1"
          className="font-bungee text-3xl sm:text-4xl text-white mb-4"
        />

        <p className="font-space text-gray-400 text-lg mb-3">
          No worries — your cart is still waiting!
        </p>
        <p className="font-space text-gray-500 text-sm mb-10">
          Changed your mind? That&apos;s cool. Your items are still in your cart
          whenever you&apos;re ready to commit to the chaos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NeonButton href="/cart" variant="pink" size="lg">
            Back to Cart 🛒
          </NeonButton>
          <NeonButton href="/products" variant="blue" size="lg">
            Keep Browsing
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
