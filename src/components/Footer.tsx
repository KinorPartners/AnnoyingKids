'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative bg-dark-surface border-t border-dark-border">
      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-pink to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">😈</span>
              <span className="font-bungee text-xl text-white">
                ANNOYING<span className="text-neon-pink">KIDS</span>
              </span>
            </Link>
            <p className="font-space text-gray-500 text-sm leading-relaxed">
              Merch for the next generation of professional troublemakers. 
              Annoying by design, awesome by default.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center
                  text-gray-500 hover:text-neon-pink hover:border-neon-pink/30 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center
                  text-gray-500 hover:text-neon-blue hover:border-neon-blue/30 transition-all duration-300"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.19 8.19 0 004.77 1.53V6.79a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center
                  text-gray-500 hover:text-neon-green hover:border-neon-green/30 transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bungee text-neon-pink text-sm mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', href: '/products' },
                { label: 'T-Shirts', href: '/products?category=tees' },
                { label: 'Hoodies', href: '/products?category=hoodies' },
                { label: 'Mugs', href: '/products?category=mugs' },
                { label: 'Stickers', href: '/products?category=stickers' },
                { label: 'Caps', href: '/products?category=caps' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-space text-gray-500 text-sm hover:text-neon-pink transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bungee text-neon-green text-sm mb-4">Info</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping Info', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'FAQ', href: '/faq' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-space text-gray-500 text-sm hover:text-neon-green transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bungee text-neon-blue text-sm mb-4">Join the Chaos</h3>
            <p className="font-space text-gray-500 text-sm mb-4">
              Get exclusive drops, secret discounts, and maximum chaos delivered
              to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 
                    font-space text-sm text-white placeholder-gray-600
                    focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]
                    transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-neon-blue text-dark-bg font-bungee text-sm uppercase rounded-lg
                  hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {subscribed ? '🎉 You\'re In!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Kid Chaos game promo */}
        <style>{`
          @keyframes kid-run {
            0%   { transform: translateX(-60px); }
            100% { transform: translateX(calc(var(--chase-w, 400px) + 60px)); }
          }
          @keyframes dad-run {
            0%   { transform: translateX(-100px); }
            100% { transform: translateX(calc(var(--chase-w, 400px) + 20px)); }
          }
          @keyframes mom-run {
            0%   { transform: translateX(-140px); }
            100% { transform: translateX(calc(var(--chase-w, 400px) - 20px)); }
          }
          .chase-kid { animation: kid-run 2.8s linear infinite; }
          .chase-dad { animation: dad-run 2.8s linear infinite; animation-delay: 0.55s; }
          .chase-mom { animation: mom-run 2.8s linear infinite; animation-delay: 1.1s; }
        `}</style>

        <div className="mt-12 mb-2">
          <Link
            href="/#game"
            className="group block relative overflow-hidden rounded-2xl border border-neon-pink/20 bg-dark-card/60
              hover:border-neon-pink/50 hover:shadow-[0_0_20px_rgba(255,45,120,0.15)] transition-all duration-300 px-6 py-4"
          >
            {/* Label */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-bungee text-sm text-neon-pink uppercase tracking-widest">
                🎮 Play Kid Chaos
              </span>
              <span className="font-space text-gray-600 text-xs group-hover:text-gray-400 transition-colors">
                Escape your parents →
              </span>
            </div>

            {/* Candy dots track */}
            <div className="relative h-9 overflow-hidden rounded-lg bg-dark-surface/50">
              {/* Static candy dots */}
              {[8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78, 83, 88].map((pct) => (
                <div
                  key={pct}
                  style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#ff2d78',
                    boxShadow: '0 0 4px #ff2d78',
                    opacity: 0.5,
                  }}
                />
              ))}

              {/* Chasing emojis */}
              <span
                className="chase-mom absolute top-0 leading-none select-none"
                style={{ fontSize: 26, lineHeight: '36px' }}
              >👩</span>
              <span
                className="chase-dad absolute top-0 leading-none select-none"
                style={{ fontSize: 26, lineHeight: '36px' }}
              >👨</span>
              <span
                className="chase-kid absolute top-0 leading-none select-none"
                style={{ fontSize: 26, lineHeight: '36px' }}
              >🧒</span>
            </div>
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-space text-gray-600 text-xs">
            © {new Date().getFullYear()} AnnoyingKids. All rights reserved. Stay chaotic. 😈
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="font-space text-gray-600 text-xs hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-space text-gray-600 text-xs hover:text-gray-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
