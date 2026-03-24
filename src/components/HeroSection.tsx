'use client';

import React from 'react';
import GlitchText from './GlitchText';
import NeonButton from './NeonButton';

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,45,120,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/10 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-green/5 rounded-full blur-[80px] animate-float"
          style={{ animationDelay: '2s' }}
        />

        {/* Scanline overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Small tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-pink/10 border border-neon-pink/20 rounded-full mb-4">
          <span className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
          <span className="font-space text-neon-pink text-sm uppercase tracking-widest">
            For Professional Troublemakers
          </span>
        </div>

        {/* Main headline */}
        <div className="mb-4">
          <GlitchText
            text="UNLEASH THE CHAOS"
            as="h1"
            className="font-bungee text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none"
          />
        </div>

        {/* Subtext */}
        <p className="font-space text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
          Merch for kids who color outside the lines, talk back to the tutorial,
          and make{' '}
          <span className="text-neon-green font-bold">main character energy</span>{' '}
          look easy.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NeonButton href="/products" variant="pink" size="lg">
            Shop the Chaos
          </NeonButton>
          <NeonButton href="/about" variant="blue" size="lg">
            Our Story
          </NeonButton>
          <NeonButton href="/#game" variant="green" size="lg">
            🎮 Play Kid Chaos
          </NeonButton>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-8">
          <div className="text-center">
            <p className="font-bungee text-neon-pink text-2xl sm:text-3xl">100%</p>
            <p className="font-space text-gray-500 text-xs sm:text-sm mt-1">
              Parent-Tested
            </p>
          </div>
          <div className="w-px h-12 bg-dark-border" />
          <div className="text-center">
            <p className="font-bungee text-neon-green text-2xl sm:text-3xl">∞</p>
            <p className="font-space text-gray-500 text-xs sm:text-sm mt-1">
              Chaos Level
            </p>
          </div>
          <div className="w-px h-12 bg-dark-border" />
          <div className="text-center">
            <p className="font-bungee text-neon-blue text-2xl sm:text-3xl">6-16</p>
            <p className="font-space text-gray-500 text-xs sm:text-sm mt-1">
              Age Range
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-bg to-transparent" />
    </section>
  );
}
