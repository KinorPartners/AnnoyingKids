import { MOCK_PRODUCTS } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

// Pre-generate static shells for all known product slugs at build time.
// New Printify products will be fetched client-side.
// Add their slugs here after publishing new products in Printify.
export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
