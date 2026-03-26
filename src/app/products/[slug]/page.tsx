import type { Metadata } from 'next';
import { getProductsForBuild } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProductsForBuild();
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.title,
    description: product.description?.slice(0, 155),
    alternates: { canonical: `https://www.annoyingkids.com/products/${slug}` },
  };
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Pre-generate a static page for every product in Printify (+ fallback mocks)
export async function generateStaticParams() {
  const products = await getProductsForBuild();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getProductsForBuild();
  const product  = products.find((p) => p.slug === slug) ?? null;
  return <ProductDetailClient product={product} allProducts={products} />;
}
