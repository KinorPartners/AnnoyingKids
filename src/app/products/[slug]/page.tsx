import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import ProductDetail from '@/components/ProductDetail';
import NeonButton from '@/components/NeonButton';

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 inline-block">😵</span>
          <h1 className="font-bungee text-3xl text-white mb-4">Product Not Found</h1>
          <p className="font-space text-gray-500 mb-8">
            This product must have been too chaotic even for us.
          </p>
          <NeonButton href="/products" variant="pink">
            Back to Shop
          </NeonButton>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
