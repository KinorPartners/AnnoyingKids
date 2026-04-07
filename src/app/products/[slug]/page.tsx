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
    title: `${product.title} — AnnoyingKids`,
    description: product.description?.slice(0, 155),
    alternates: { canonical: `https://annoyingkids.com/products/${slug}` },
    openGraph: {
      title: `${product.title} — AnnoyingKids`,
      description: product.description?.slice(0, 155) ?? '',
      url: `https://annoyingkids.com/products/${slug}`,
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
    ? (() => {
        const availablePrices = product.variants
          .filter(v => v.isAvailable)
          .map(v => v.price);
        const lowPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : product.price;
        const highPrice = availablePrices.length > 0 ? Math.max(...availablePrices) : product.price;
        const multipleVariants = product.variants.length > 1;
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: product.images.slice(0, 3),
          url: `https://annoyingkids.com/products/${slug}`,
          sku: product.variants[0]?.id,
          brand: { '@type': 'Brand', name: 'AnnoyingKids' },
          offers: multipleVariants
            ? {
                '@type': 'AggregateOffer',
                lowPrice: lowPrice.toFixed(2),
                highPrice: highPrice.toFixed(2),
                priceCurrency: 'USD',
                offerCount: product.variants.filter(v => v.isAvailable).length,
                availability: 'https://schema.org/InStock',
                seller: { '@type': 'Organization', name: 'AnnoyingKids' },
              }
            : {
                '@type': 'Offer',
                price: product.price.toFixed(2),
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: `https://annoyingkids.com/products/${slug}`,
                seller: { '@type': 'Organization', name: 'AnnoyingKids' },
              },
        };
      })()
    : null;

  const breadcrumbSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://annoyingkids.com' },
          { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://annoyingkids.com/products' },
          { '@type': 'ListItem', position: 3, name: product.title, item: `https://annoyingkids.com/products/${slug}` },
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
