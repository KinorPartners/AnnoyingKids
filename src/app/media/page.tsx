import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Press & Media Kit — AnnoyingKids',
  description:
    'Press kit for AnnoyingKids — brand story, logo and image assets, key facts, brand colours and press contact. Bold, loud print-on-demand merch for kids 6-16.',
  alternates: { canonical: 'https://annoyingkids.com/media' },
  openGraph: {
    title: 'Press & Media Kit — AnnoyingKids',
    description: 'Brand story, logo and image assets, key facts, and press contact for AnnoyingKids.',
    url: 'https://annoyingkids.com/media',
    siteName: 'AnnoyingKids',
    type: 'website',
    images: [{ url: 'https://annoyingkids.com/opengraph-image.png', width: 1200, height: 630, alt: 'AnnoyingKids Press Kit' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://annoyingkids.com/opengraph-image.png'] },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://annoyingkids.com' },
    { '@type': 'ListItem', position: 2, name: 'Press & Media', item: 'https://annoyingkids.com/media' },
  ],
};

const BRAND_COLORS = [
  { name: 'Neon Pink', hex: '#ff2d78', label: 'Primary' },
  { name: 'Neon Green', hex: '#39ff14', label: 'Accent' },
  { name: 'Neon Blue', hex: '#00f0ff', label: 'Accent' },
  { name: 'Neon Yellow', hex: '#fff200', label: 'Accent' },
  { name: 'Dark BG', hex: '#0a0a0a', label: 'Background' },
];

const KEY_FACTS = [
  { label: 'Founded', value: '2025' },
  { label: 'Target audience', value: 'Kids aged 6–16 (purchased by parents)' },
  { label: 'Product categories', value: 'T-shirts, hoodies, mugs, stickers, caps' },
  { label: 'Fulfillment model', value: 'Print-on-demand via Printify' },
  { label: 'Shipping', value: 'US & international' },
  { label: 'Tagline', value: 'Annoying by design. Awesome by default.' },
];

export default function MediaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 font-space text-sm mb-10" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-500 hover:text-neon-pink transition-colors">Home</Link>
            <span className="text-gray-700">/</span>
            <span className="text-neon-pink">Press &amp; Media</span>
          </nav>

          <div className="text-center mb-16">
            <span className="font-space text-neon-pink text-sm uppercase tracking-widest">For Journalists & Creators</span>
            <h1 className="font-bungee text-4xl sm:text-5xl text-white mt-4">
              Press &amp; <span className="text-neon-pink">Media Kit</span>
            </h1>
            <p className="font-space text-gray-500 mt-4 max-w-xl mx-auto">
              Everything you need to write about AnnoyingKids. Brand story, assets, facts, and contact.
            </p>
          </div>

          <div className="space-y-8">

            {/* Brand Overview */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <h2 className="font-bungee text-white text-xl mb-4">Brand Overview</h2>
              <div className="font-space text-gray-400 text-sm leading-relaxed space-y-3">
                <p>
                  <strong className="text-white">AnnoyingKids</strong> is a print-on-demand merch brand for kids aged 6–16
                  who live life at maximum volume. We make bold, loud graphic tees, hoodies, mugs, stickers, and caps
                  for kids who refuse to blend in — and the parents who love them for it.
                </p>
                <p>
                  Every item is made to order when purchased — no inventory, no waste, shipped directly from our
                  print partner to the customer's door. We ship to the US and internationally.
                </p>
                <p>
                  The brand was built on a simple belief: every &ldquo;annoying&rdquo; kid is a future innovator,
                  comedian, artist, or leader who just hasn&apos;t been handed a microphone yet. So we made the
                  microphone. And put it on a t-shirt.
                </p>
              </div>
            </div>

            {/* Key Facts */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <h2 className="font-bungee text-white text-xl mb-4">Key Facts</h2>
              <div className="divide-y divide-dark-border">
                {KEY_FACTS.map((fact) => (
                  <div key={fact.label} className="flex justify-between py-3">
                    <span className="font-space text-gray-500 text-sm">{fact.label}</span>
                    <span className="font-space text-gray-300 text-sm text-right max-w-[60%]">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Assets */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <h2 className="font-bungee text-white text-xl mb-4">Brand Assets</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/logo.png"
                  download
                  className="flex flex-col items-center gap-3 p-6 bg-dark-surface border border-dark-border rounded-xl
                    hover:border-neon-pink/40 transition-all group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="AnnoyingKids logo" width={80} height={80} className="opacity-90 group-hover:opacity-100" />
                  <span className="font-bungee text-gray-400 text-xs uppercase tracking-wider group-hover:text-neon-pink transition-colors">
                    Download Logo
                  </span>
                </a>
                <a
                  href="/favicon.png"
                  download
                  className="flex flex-col items-center gap-3 p-6 bg-dark-surface border border-dark-border rounded-xl
                    hover:border-neon-pink/40 transition-all group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/favicon.png" alt="AnnoyingKids icon" width={80} height={80} className="opacity-90 group-hover:opacity-100" />
                  <span className="font-bungee text-gray-400 text-xs uppercase tracking-wider group-hover:text-neon-pink transition-colors">
                    Download Icon
                  </span>
                </a>
              </div>
              <p className="font-space text-gray-600 text-xs mt-4">
                Please do not alter, recolor, or distort the logo. Dark backgrounds preferred.
              </p>
            </div>

            {/* Brand Colors */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <h2 className="font-bungee text-white text-xl mb-4">Brand Colors</h2>
              <div className="flex flex-wrap gap-3">
                {BRAND_COLORS.map((c) => (
                  <div key={c.hex} className="flex flex-col items-center gap-2">
                    <div
                      className="w-14 h-14 rounded-xl border border-dark-border shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-space text-gray-400 text-xs">{c.hex}</span>
                    <span className="font-space text-gray-600 text-xs">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Press Contact */}
            <div className="bg-neon-pink/5 border border-neon-pink/20 rounded-2xl p-8">
              <h2 className="font-bungee text-white text-xl mb-3">Press Contact</h2>
              <p className="font-space text-gray-400 text-sm leading-relaxed mb-4">
                For media inquiries, interview requests, product samples, or collaboration proposals:
              </p>
              <a
                href="mailto:press@annoyingkids.com"
                className="inline-block font-bungee text-neon-pink hover:underline text-lg"
              >
                press@annoyingkids.com
              </a>
              <p className="font-space text-gray-600 text-xs mt-3">
                We typically respond within 1–2 business days.
              </p>
            </div>

          </div>

          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              href="/about"
              className="px-6 py-3 border border-dark-border rounded-lg font-space text-sm text-gray-400
                hover:border-neon-blue/40 hover:text-neon-blue transition-all"
            >
              Read Our Story →
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 border border-dark-border rounded-lg font-space text-sm text-gray-400
                hover:border-neon-pink/40 hover:text-neon-pink transition-all"
            >
              Browse Products →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
