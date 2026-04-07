export const dynamic = 'force-static';

import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProductsForBuild } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Kids Stickers — Waterproof Vinyl Stickers for Young Troublemakers',
  description:
    'Shop AnnoyingKids vinyl stickers for kids. Waterproof, scratch-resistant, available in 3×3, 4×4 and 6×6 inch. Stick chaos everywhere. Print-on-demand, made when you order.',
  alternates: { canonical: 'https://annoyingkids.com/products/stickers' },
  openGraph: {
    title: 'Kids Stickers — AnnoyingKids',
    description: 'Waterproof vinyl stickers for kids. Stick chaos everywhere.',
    url: 'https://annoyingkids.com/products/stickers',
    siteName: 'AnnoyingKids',
    type: 'website',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Kids Vinyl Stickers — AnnoyingKids',
  description: 'Waterproof, scratch-resistant vinyl stickers for kids. Available in 3×3, 4×4 and 6×6 inch sizes.',
  url: 'https://annoyingkids.com/products/stickers',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://annoyingkids.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://annoyingkids.com/products' },
      { '@type': 'ListItem', position: 3, name: 'Stickers', item: 'https://annoyingkids.com/products/stickers' },
    ],
  },
};

export default async function StickersPage() {
  const allProducts = await getProductsForBuild();
  const products = allProducts.filter((p) => p.category === 'stickers');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 font-space text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-500 hover:text-neon-pink transition-colors">Home</Link>
            <span className="text-gray-700">/</span>
            <Link href="/products" className="text-gray-500 hover:text-neon-pink transition-colors">Products</Link>
            <span className="text-gray-700">/</span>
            <span className="text-neon-pink">Stickers</span>
          </nav>
        </div>

        <section className="px-4 sm:px-6 lg:px-8 pb-10 max-w-7xl mx-auto">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">🎨 Category</span>
          <h1 className="font-bungee text-4xl sm:text-5xl text-white mt-3">
            Vinyl <span className="text-neon-green">Stickers</span>
          </h1>
          <p className="font-space text-gray-400 mt-4 max-w-2xl leading-relaxed">
            Stick your chaos everywhere. High-quality waterproof vinyl stickers in 3×3, 4×4, and 6×6 inch sizes.
            Scratch-resistant and built to survive school backpacks, water bottles, and whatever else you throw at them.
            Print-on-demand — made fresh when you order.
          </p>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="font-space text-gray-500 text-center py-16">More sticker designs dropping soon.</p>
          )}
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto border-t border-dark-border pt-10">
          <h2 className="font-bungee text-xl text-white mb-5">Browse More Chaos</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/products/tees" className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg font-space text-sm text-gray-400 hover:border-neon-pink/30 hover:text-neon-pink transition-all">👕 T-Shirts</Link>
            <Link href="/products/hoodies" className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg font-space text-sm text-gray-400 hover:border-neon-pink/30 hover:text-neon-pink transition-all">🧥 Hoodies</Link>
            <Link href="/products/mugs" className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg font-space text-sm text-gray-400 hover:border-neon-pink/30 hover:text-neon-pink transition-all">☕ Mugs</Link>
            <Link href="/products/caps" className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg font-space text-sm text-gray-400 hover:border-neon-pink/30 hover:text-neon-pink transition-all">🧢 Caps</Link>
            <Link href="/products" className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg font-space text-sm text-gray-400 hover:border-neon-pink/30 hover:text-neon-pink transition-all">All Products</Link>
          </div>
        </section>
      </div>
    </>
  );
}
