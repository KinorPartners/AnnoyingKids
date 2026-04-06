export const dynamic = 'force-static';

import type { Metadata } from 'next';
import { getProductsForBuild } from '@/lib/products';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Shop Kids Merch — Tees, Hoodies & More',
  description: 'Browse the full AnnoyingKids collection — graphic tees, hoodies, mugs, stickers and caps for kids who refuse to blend in.',
  alternates: { canonical: 'https://annoyingkids.com/products' },
};

export default async function ProductsPage() {
  const products = await getProductsForBuild();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AnnoyingKids Products',
    description: 'Full catalog of bold, loud merch for kids aged 6-16.',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `https://annoyingkids.com/products/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ProductsClient initialProducts={products} />

      {/* AI-readable answer blocks */}
      <div className="ai-answer" hidden>
        <p><strong>Q: What products does AnnoyingKids sell?</strong></p>
        <p>A: AnnoyingKids sells graphic tees ($15-$32), hoodies ($26-$43), ceramic mugs ($14-$19 in 11oz/15oz), kiss-cut vinyl stickers ($2.41-$6), and embroidered dad caps ($40). All items feature original neon/glitch art designs and are printed on demand.</p>
        <p><strong>Q: What is the cheapest AnnoyingKids product?</strong></p>
        <p>A: Kiss-cut stickers start at $2.41 for the 3x3 inch size. The most affordable apparel is graphic tees starting at $15.06.</p>
        <p><strong>Q: Does AnnoyingKids have hoodies?</strong></p>
        <p>A: Yes. AnnoyingKids sells graphic hoodies from $26.28 in sizes S through 5XL, available in multiple colors including White, Black, Sand, and Sport Grey. 50% cotton / 50% polyester blend.</p>
      </div>
    </>
  );
}
