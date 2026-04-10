'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="AnnoyingKids"
              width={200}
              height={48}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="font-space text-gray-400 hover:text-neon-green transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="font-space text-gray-400 hover:text-neon-blue transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              📝 Blog
            </Link>
            <Link
              href="/chaos-lab"
              className="font-space text-gray-400 hover:text-neon-yellow transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              💡 Chaos Lab
            </Link>
            <Link
              href="/wall-of-chaos"
              className="font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              📸 Wall
            </Link>
            <Link
              href="/characters-v2"
              className="font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              🎮 The Gang
            </Link>
            <Link
              href="/game"
              className="font-space text-neon-green hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider
                px-3 py-1 border border-neon-green/30 rounded-lg hover:bg-neon-green/10 hover:border-neon-green/60
                hover:shadow-[0_0_10px_rgba(57,255,20,0.3)]"
            >
              🎮 Play
            </Link>
          </nav>

          {/* Theme toggle + Cart + Mobile menu */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-dark-border
                hover:border-neon-yellow/50 hover:shadow-[0_0_12px_rgba(255,242,0,0.15)] transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to bright mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Bright mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-yellow" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg 
                hover:border-neon-pink/50 hover:shadow-[0_0_15px_rgba(255,45,120,0.2)] transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-neon-pink rounded-full flex items-center justify-center text-white text-xs font-bungee animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-dark-border py-4 space-y-3">
            <Link
              href="/"
              className="block font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block font-space text-gray-400 hover:text-neon-green transition-colors duration-300 text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block font-space text-gray-400 hover:text-neon-blue transition-colors duration-300 text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              📝 Blog
            </Link>
            <Link
              href="/chaos-lab"
              className="block font-space text-gray-400 hover:text-neon-yellow transition-colors duration-300 text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              💡 Chaos Lab
            </Link>
            <Link
              href="/wall-of-chaos"
              className="block font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              📸 Wall of Chaos
            </Link>
            <Link
              href="/characters-v2"
              className="block font-space text-gray-400 hover:text-neon-pink transition-colors duration-300 text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🎮 The Gang
            </Link>
            <Link
              href="/game"
              className="block font-space text-neon-green text-sm uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🎮 Play Kid Chaos
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
