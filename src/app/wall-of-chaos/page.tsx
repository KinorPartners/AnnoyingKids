'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface WallEntry {
  id: number;
  name: string;
  age: number;
  city: string;
  caption: string;
  emoji: string;
  color: string;
}

const MOCK_WALL: WallEntry[] = [
  { id: 1, name: 'Alex K.', age: 10, city: 'New York', caption: "Wearing my Glitch Hoodie at school drop-off. Teacher said it's too cool 😎", emoji: '🧒', color: '#ff2d78' },
  { id: 2, name: 'Maya S.', age: 12, city: 'LA', caption: 'Got the sticker pack and covered my entire laptop. Mom is not happy 😂', emoji: '👧', color: '#00f0ff' },
  { id: 3, name: 'Jake T.', age: 8, city: 'Chicago', caption: 'Matching with my best friend! Same hoodie different sizes lol', emoji: '🧒', color: '#39ff14' },
  { id: 4, name: 'Sofia R.', age: 11, city: 'Miami', caption: 'Wore the What\'s For Dinner tee to dinner and my dad laughed for 5 mins', emoji: '👧', color: '#fff200' },
  { id: 5, name: 'Leo W.', age: 9, city: 'Austin', caption: "This cap is literally attached to my head now. Can't take it off.", emoji: '🧒', color: '#a855f7' },
  { id: 6, name: 'Zara B.', age: 13, city: 'Seattle', caption: "My whole squad ordered stickers. We're basically a gang now 😈", emoji: '👧', color: '#ff6b35' },
];

export default function WallOfChaosPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-bungee leading-tight">
          <span className="block text-5xl sm:text-7xl text-white" style={{ textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
            WALL OF
          </span>
          <span
            className="block text-6xl sm:text-8xl text-neon-pink"
            style={{ textShadow: '0 0 30px rgba(255,45,120,0.6)' }}
          >
            CHAOS
          </span>
        </h1>
        <p className="font-space text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mt-6">
          Real kids. Real chaos. Submit your pic wearing AnnoyingKids gear and{' '}
          <span className="text-neon-green">join the wall.</span>
        </p>
      </section>

      {/* Submission Form */}
      <section id="submit-form" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <h2 className="font-bungee text-2xl text-white mb-6">
            GET ON THE WALL 📸
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📸</div>
              <p className="font-bungee text-xl text-neon-green mb-3">
                YOU&apos;RE IN THE QUEUE!
              </p>
              <p className="font-space text-gray-400 leading-relaxed">
                Thanks! Email your photo to{' '}
                <a
                  href="mailto:photos@annoyingkids.com"
                  className="text-neon-blue hover:underline"
                >
                  photos@annoyingkids.com
                </a>{' '}
                with your name. We&apos;ll add you to the wall! 📸
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2 border border-neon-pink/50 text-neon-pink font-space text-sm rounded-lg hover:bg-neon-pink/10 transition-all"
              >
                Submit another entry
              </button>
            </div>
          ) : (
            <form
              action="https://formsubmit.co/hello@annoyingkids.com"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <input type="hidden" name="_subject" value="Wall of Chaos Submission" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://annoyingkids.com/wall-of-chaos" />

              <div>
                <label className="block font-bungee text-sm text-gray-400 mb-2">
                  YOUR NAME / HANDLE <span className="text-neon-pink">*</span>
                </label>
                <input
                  type="text"
                  name="handle"
                  required
                  placeholder="e.g. CoolKid_77"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bungee text-sm text-gray-400 mb-2">
                    AGE <span className="text-gray-600 font-space text-xs normal-case">(optional)</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min={1}
                    max={18}
                    placeholder="e.g. 11"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-bungee text-sm text-gray-400 mb-2">
                    CITY <span className="text-gray-600 font-space text-xs normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. New York"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
                  />
                </div>
              </div>

              {/* Photo upload note */}
              <div className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                <p className="font-space text-neon-blue text-sm leading-relaxed">
                  <strong>📸 Photo note:</strong> After submitting this form, email your photo to{' '}
                  <a href="mailto:photos@annoyingkids.com" className="underline hover:text-white transition-colors">
                    photos@annoyingkids.com
                  </a>{' '}
                  with your name in the subject line. We&apos;ll handle the rest!
                </p>
              </div>

              <div>
                <label className="block font-bungee text-sm text-gray-400 mb-2">
                  PHOTO <span className="text-gray-600 font-space text-xs normal-case">(attach when emailing)</span>
                </label>
                <div className="w-full bg-dark-surface border border-dashed border-dark-border rounded-lg px-4 py-6 text-center">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">📷</span>
                    <span className="font-space text-gray-500 text-sm">
                      Click to select a photo (optional preview)
                    </span>
                    <span className="font-space text-gray-600 text-xs">
                      Remember: send the actual photo by email!
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bungee text-sm text-gray-400 mb-2">
                  CAPTION <span className="text-neon-pink">*</span>
                </label>
                <input
                  type="text"
                  name="caption"
                  required
                  placeholder="Tell us what's going on in your pic..."
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 font-space text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neon-pink text-white font-bungee text-lg uppercase rounded-lg
                  shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.7)]
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                JOIN THE WALL 📸
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="font-bungee text-3xl sm:text-4xl text-white">
            THE WALL 🧱
          </h2>
          <p className="font-space text-gray-500 mt-2">
            These kids are living their best chaotic lives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_WALL.map((entry) => (
            <div
              key={entry.id}
              className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden transition-all duration-300
                hover:scale-[1.02]"
              style={{
                borderColor: `${entry.color}40`,
                boxShadow: `0 0 0 0 ${entry.color}00`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${entry.color}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${entry.color}00`;
              }}
            >
              {/* Emoji placeholder */}
              <div
                className="h-48 flex items-center justify-center text-8xl relative overflow-hidden"
                style={{ background: `${entry.color}15` }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at center, ${entry.color} 0%, transparent 70%)`,
                  }}
                />
                <span className="relative z-10 select-none">{entry.emoji}</span>

                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="font-bungee text-sm"
                    style={{ color: entry.color }}
                  >
                    {entry.name}
                  </span>
                  {entry.age && (
                    <span className="px-2 py-0.5 bg-dark-surface border border-dark-border rounded-full font-space text-xs text-gray-500">
                      age {entry.age}
                    </span>
                  )}
                  {entry.city && (
                    <span className="px-2 py-0.5 bg-dark-surface border border-dark-border rounded-full font-space text-xs text-gray-500">
                      📍 {entry.city}
                    </span>
                  )}
                </div>
                <p className="font-space text-gray-400 text-sm italic leading-relaxed">
                  &ldquo;{entry.caption}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-10">
          <p className="font-bungee text-2xl sm:text-3xl text-gray-500 mb-4">
            YOUR PHOTO COULD BE HERE 👆
          </p>
          <p className="font-space text-gray-500 mb-8">
            Rocking AnnoyingKids gear? Show us. We&apos;ll put you on the wall.
          </p>
          <a
            href="#submit-form"
            className="inline-block px-8 py-4 bg-neon-pink text-white font-bungee text-lg uppercase rounded-lg
              shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.7)]
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            SUBMIT YOUR PHOTO 📸
          </a>
          <div className="mt-6">
            <Link
              href="/products"
              className="font-space text-gray-600 text-sm hover:text-neon-blue transition-colors"
            >
              Don&apos;t have gear yet? Get some →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
