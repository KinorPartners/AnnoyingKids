export const dynamic = 'force-static';

import type { Metadata } from 'next';
import { getProductsForBuild } from '@/lib/products';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Shop Kids Merch — Tees, Hoodies & More',
  description: 'Browse the full AnnoyingKids collection — graphic tees, hoodies, mugs, stickers and caps for kids who refuse to blend in.',
  alternates: { canonical: 'https://www.annoyingkids.com/products' },
};

export default async function ProductsPage() {
  const products = await getProductsForBuild();
  return <ProductsClient initialProducts={products} />;
}
