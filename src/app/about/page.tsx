import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import GlitchText from '@/components/GlitchText';
import NeonButton from '@/components/NeonButton';

export const metadata: Metadata = {
  title: 'About Us — Bold Merch for Brave Kids',
  description: 'The story behind AnnoyingKids — bold, loud merch made for kids who refuse to blend in.',
  alternates: { canonical: 'https://annoyingkids.com/about' },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://annoyingkids.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://annoyingkids.com/about' },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center gap-2 font-space text-sm" aria-label="Breadcrumb">
          <Link href="/" className="text-gray-500 hover:text-neon-pink transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <span className="text-neon-pink">About</span>
        </nav>
      </div>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="font-space text-neon-blue text-sm uppercase tracking-widest">
            Our Story
          </span>
          <div className="mt-4 mb-6">
            <GlitchText
              text="ANNOYING BY DESIGN"
              as="h1"
              className="font-bungee text-4xl sm:text-5xl md:text-6xl text-white"
            />
          </div>
          <p className="font-space text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We didn&apos;t set out to build a merch brand. We set out to give every kid
            a uniform for being unapologetically themselves.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-4xl mx-auto">
        <div className="space-y-16">
          {/* Origin */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <h2 className="font-bungee text-2xl sm:text-3xl text-neon-pink mb-6">
                How It Started
              </h2>
              <div className="font-space text-gray-400 leading-relaxed space-y-4">
                <p>
                  It started with a kid who wouldn&apos;t stop asking &quot;why?&quot; — not to be
                  difficult, but because the world is genuinely confusing when
                  you&apos;re under 4 feet tall and everyone keeps telling you to
                  sit still.
                </p>
                <p>
                  We realized something: every &quot;annoying&quot; kid is just a future
                  innovator, comedian, artist, or leader who hasn&apos;t been handed a
                  microphone yet. So we made the microphone. And put it on a t-shirt.
                </p>
                <p>
                  AnnoyingKids was born from the belief that the kids who color
                  outside the lines, talk too loud, and question everything are the
                  ones who change the world. They just need merch that matches their
                  energy.
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="aspect-square bg-dark-card border border-dark-border rounded-2xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 to-neon-blue/5 group-hover:from-neon-pink/10 group-hover:to-neon-blue/10 transition-all duration-500" />
                <span className="text-[100px] relative z-10 group-hover:scale-110 transition-transform duration-500">
                  😈
                </span>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="relative z-10">
              <h2 className="font-bungee text-2xl sm:text-3xl text-neon-blue mb-6">
                The &quot;Annoying by Design&quot; Philosophy
              </h2>
              <div className="font-space text-gray-400 leading-relaxed space-y-4">
                <p>
                  Here&apos;s what we believe: &quot;annoying&quot; is just another word for
                  &quot;unforgettable.&quot; The kids who ask the hard questions, who can&apos;t sit
                  still, who have opinions about everything — those are our people.
                </p>
                <p>
                  Our designs are intentionally bold, unapologetically loud, and
                  designed to make a statement. We use neon colors because subtlety
                  is boring. We use glitch effects because perfection is overrated.
                  We use bold fonts because whispering never changed anything.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                <div className="text-center">
                  <span className="text-4xl mb-3 inline-block">🎨</span>
                  <h3 className="font-bungee text-neon-pink text-sm mb-2">Bold Design</h3>
                  <p className="font-space text-gray-500 text-sm">
                    If it doesn&apos;t turn heads, we start over.
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-4xl mb-3 inline-block">💪</span>
                  <h3 className="font-bungee text-neon-green text-sm mb-2">Quality Built</h3>
                  <p className="font-space text-gray-500 text-sm">
                    Premium materials that survive playground warfare.
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-4xl mb-3 inline-block">🌍</span>
                  <h3 className="font-bungee text-neon-blue text-sm mb-2">Print on Demand</h3>
                  <p className="font-space text-gray-500 text-sm">
                    Made when you order. Less waste, more chaos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="text-center">
            <h2 className="font-bungee text-2xl sm:text-3xl text-neon-green mb-6">
              Our Mission
            </h2>
            <p className="font-space text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              To give every kid aged 6-16 the confidence to be exactly who they
              are — loud, curious, creative, and perfectly &quot;annoying.&quot; One piece
              of chaotic merch at a time.
            </p>
            <NeonButton href="/products" variant="pink" size="lg">
              Join the Chaos →
            </NeonButton>
          </div>
        </div>
      </section>
    </div>
  );
}
