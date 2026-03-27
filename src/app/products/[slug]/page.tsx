export const dynamic = 'force-static';

import type { Metadata } from 'next';
import { getProductsForBuild } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProductsForBuild();
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };

  const imageUrl = product.images[0];

  return {
    title: product.title,
    description: product.description?.slice(0, 155),
    alternates: { canonical: `https://www.annoyingkids.com/products/${slug}` },
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 155) ?? '',
      url: `https://www.annoyingkids.com/products/${slug}`,
      siteName: 'AnnoyingKids',
      type: 'website',
      images: imageUrl
        ? [{ url: imageUrl, width: 800, height: 800, alt: product.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description?.slice(0, 155) ?? '',
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

// Pre-generate a static page for every product in Printify (+ fallback mocks)
export async function generateStaticParams() {
  const products = await getProductsForBuild();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getProductsForBuild();
  const product = products.find((p) => p.slug === slug) ?? null;

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images.slice(0, 3),
        url: `https://www.annoyingkids.com/products/${slug}`,
        sku: product.variants[0]?.id,
        brand: { '@type': 'Brand', name: 'AnnoyingKids' },
        audience: { '@type': 'PeopleAudience', suggestedMinAge: 6, suggestedMaxAge: 16 },
        offers: {
          '@type': 'Offer',
          price: product.price.toFixed(2),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://www.annoyingkids.com/products/${slug}`,
          seller: { '@type': 'Organization', name: 'AnnoyingKids' },
        },
      }
    : null;

  const breadcrumbSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://www.annoyingkids.com' },
          { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.annoyingkids.com/products' },
          { '@type': 'ListItem', position: 3, name: product.title, item: `https://www.annoyingkids.com/products/${slug}` },
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <ProductDetailClient product={product} allProducts={products} />
    </>
  );
}
