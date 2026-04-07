export const dynamic = 'force-static';

import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { Kid, Dad, Mom, Grandma, Grandpa } from '@/components/Characters';
import FeatureCard from '@/components/FeatureCard';
import NeonButton from '@/components/NeonButton';
import GlitchText from '@/components/GlitchText';
import { getProductsForBuild } from '@/lib/products';

export default async function HomePage() {
  const products = await getProductsForBuild();
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">
            Hot Drops 🔥
          </span>
          <h2 className="font-bungee text-3xl sm:text-4xl md:text-5xl text-white mt-4">
            Featured <span className="text-neon-pink">Chaos</span>
          </h2>
          <p className="font-space text-gray-500 mt-4 max-w-xl mx-auto">
            Our most popular gear for maximum main character energy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <NeonButton href="/products" variant="green" size="lg">
            View All Products →
          </NeonButton>
        </div>
      </section>

      {/* Chaos by Design Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="font-space text-neon-blue text-sm uppercase tracking-widest">
              Why We&apos;re Different
            </span>
            <h2 className="font-bungee text-3xl sm:text-4xl md:text-5xl text-white mt-4">
              Chaos by <span className="text-neon-blue">Design</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🧪"
              title="Parent-Tested"
              description="Every piece of merch has been tested by real parents. They rolled their eyes, so we knew it was perfect. 100% guaranteed to generate at least one 'really?!' per wear."
              accentColor="pink"
            />
            <FeatureCard
              icon="⭐"
              title="Built for the Main Character"
              description="You're not a background character. Our designs are made for kids who refuse to blend in, speak up (sometimes too much), and own every room they walk into."
              accentColor="green"
            />
            <FeatureCard
              icon="🖨️"
              title="Made When You Order"
              description="Every item is printed on demand — no warehouses, no waste. Your order goes straight from our printers to your door. Better for the planet, better for your chaos budget."
              accentColor="blue"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-dark-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', label: 'US & Intl Shipping', sub: 'Tracked delivery' },
              { icon: '🔄', label: '30-Day Returns', sub: 'No questions asked' },
              { icon: '🔒', label: 'Secure Checkout', sub: 'Powered by Stripe' },
              { icon: '🖨️', label: 'Print on Demand', sub: 'Made just for you' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{badge.icon}</span>
                <p className="font-bungee text-white text-sm">{badge.label}</p>
                <p className="font-space text-gray-600 text-xs">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — replace placeholder quotes with real customer reviews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-space text-neon-pink text-sm uppercase tracking-widest">
              What Parents &amp; Kids Say
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-white mt-3">
              Certified <span className="text-neon-green">Chaos</span> Approved
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The tees arrived fast and the print quality is genuinely great. My kid refuses to wear anything else now.',
                name: 'Parent of a 10-year-old',
              },
              {
                quote: 'Ordered for my daughter\'s birthday and the quality blew me away. Looks exactly like the product images.',
                name: 'Verified buyer',
              },
              {
                quote: 'Finally merch that matches my son\'s energy. He wore it to school the next day and all his friends wanted one.',
                name: 'Happy customer',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col gap-4"
              >
                <p className="font-space text-gray-300 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="font-space text-neon-pink text-xs uppercase tracking-widest mt-auto">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 via-neon-blue/10 to-neon-green/10 rounded-3xl blur-xl" />

          <div className="relative bg-dark-card border border-dark-border rounded-3xl p-12 sm:p-16 text-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,45,120,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.5) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            <div className="relative z-10">
              <span className="text-5xl mb-6 inline-block animate-float">🚀</span>
              <GlitchText
                text="LEVEL UP YOUR"
                as="h2"
                className="font-bungee text-3xl sm:text-4xl md:text-5xl text-white mb-2"
              />
              <h2 className="font-bungee text-3xl sm:text-4xl md:text-5xl text-neon-yellow mb-6">
                MAIN CHARACTER ENERGY
              </h2>
              <p className="font-space text-gray-400 text-lg max-w-xl mx-auto mb-10">
                New designs drop regularly. Limited runs sell out fast. Grab yours before
                the chaos runs out.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NeonButton href="/products" variant="yellow" size="lg">
                  Shop Now 🛒
                </NeonButton>
                <NeonButton href="/about" variant="pink" size="lg">
                  Our Story
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kid Chaos Game — teaser linking to dedicated page */}
      <section id="game" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-dark-border bg-dark-surface/50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Grandpa size={52} />
            <Grandma size={52} />
            <Mom size={52} />
            <Dad size={52} />
            <span className="mx-3 font-bungee text-gray-500 text-2xl">vs</span>
            <Kid size={52} />
          </div>
          <h2 className="font-bungee text-3xl sm:text-4xl text-white mb-2">
            KID <span className="text-neon-pink">CHAOS</span>
          </h2>
          <p className="font-space text-gray-400 text-sm mb-6">
            Escape your family · Collect candy · Dodge your parents!<br />
            🐕 Dog power-up · ❤️ Extra lives · 🦖 Rex joins at Level 10
          </p>
          <Link
            href="/game"
            className="inline-block px-10 py-4 bg-neon-pink font-bungee text-white text-xl uppercase rounded-xl shadow-[0_0_30px_rgba(255,45,120,0.5)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,45,120,0.7)] transition-all"
          >
            🎮 Play Now!
          </Link>
        </div>
      </section>
    </div>
  );
}
