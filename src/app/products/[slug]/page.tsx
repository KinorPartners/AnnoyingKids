import { MOCK_PRODUCTS } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

// Pre-generate static pages for all products at build time.
// Fetches live Printify products first; falls back to mock slugs.
export async function generateStaticParams() {
  try {
    const res = await fetch('https://annoyingkids.com/api/products', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const products: Array<{ slug: string }> = data.products ?? [];
      if (products.length > 0) {
        // Include both live and mock slugs so nothing breaks
        const liveslugs = products.map((p) => ({ slug: p.slug }));
        const mockSlugs = MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
        const all = [...liveslugs];
        for (const m of mockSlugs) {
          if (!all.find((s) => s.slug === m.slug)) all.push(m);
        }
        return all;
      }
    }
  } catch {
    // Build-time fetch failed — fall through to mock slugs
  }
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
