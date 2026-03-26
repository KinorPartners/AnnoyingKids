'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'ak_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const grant = () => {
    localStorage.setItem(STORAGE_KEY, 'granted');
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    setVisible(false);
  };

  const deny = () => {
    localStorage.setItem(STORAGE_KEY, 'denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-dark-card border border-dark-border rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="flex-1">
          <p className="font-space text-sm text-gray-300 leading-relaxed">
            <span className="font-bungee text-white">Cookies? 🍪</span>{' '}
            We use analytics to understand how kids (and their parents) find us. No creepy stuff —
            just basic traffic data.{' '}
            <a href="/privacy" className="text-neon-blue underline underline-offset-2 hover:text-neon-pink transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={deny}
            className="px-4 py-2 text-xs font-bungee uppercase text-gray-400 border border-dark-border rounded-lg hover:border-gray-500 hover:text-gray-300 transition-all"
          >
            Essential Only
          </button>
          <button
            onClick={grant}
            className="px-5 py-2 text-xs font-bungee uppercase bg-neon-green/10 border border-neon-green/40 text-neon-green rounded-lg hover:bg-neon-green hover:text-dark-bg transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.4)]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
