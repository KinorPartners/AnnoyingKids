'use client';

import React from 'react';
import GlitchText from './GlitchText';
import NeonButton from './NeonButton';
import GamePreview from './GamePreview';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-10">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,45,120,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/10 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Two-column layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

          {/* Left: text + CTAs */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neon-pink/10 border border-neon-pink/20 rounded-full mb-3">
              <span className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
              <span className="font-space text-neon-pink text-xs uppercase tracking-widest">
                For Professional Troublemakers
              </span>
            </div>

            <div className="mb-3">
              <GlitchText
                text="UNLEASH THE CHAOS"
                as="h1"
                className="font-bungee text-4xl sm:text-5xl md:text-6xl text-white leading-none"
              />
            </div>

            <p className="font-space text-gray-400 text-base max-w-lg mx-auto lg:mx-0 mb-5 leading-relaxed">
              Merch for kids who color outside the lines and make{' '}
              <span className="text-neon-green font-bold">main character energy</span>{' '}
              look easy.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <NeonButton href="/products" variant="pink" size="lg">
                Shop the Chaos
              </NeonButton>
              <NeonButton href="/about" variant="blue" size="lg">
                Our Story
              </NeonButton>
            </div>

            {/* Compact stats */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mt-5">
              <div className="text-center">
                <p className="font-bungee text-neon-pink text-xl">100%</p>
                <p className="font-space text-gray-500 text-xs">Parent-Tested</p>
              </div>
              <div className="w-px h-8 bg-dark-border" />
              <div className="text-center">
                <p className="font-bungee text-neon-green text-xl">∞</p>
                <p className="font-space text-gray-500 text-xs">Chaos Level</p>
              </div>
              <div className="w-px h-8 bg-dark-border" />
              <div className="text-center">
                <p className="font-bungee text-neon-blue text-xl">6-16</p>
                <p className="font-space text-gray-500 text-xs">Age Range</p>
              </div>
            </div>
          </div>

          {/* Right: embedded game preview */}
          <div className="flex justify-center lg:justify-end">
            <GamePreview />
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-bg to-transparent" />
    </section>
  );
}
