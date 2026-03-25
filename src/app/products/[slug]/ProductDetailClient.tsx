'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/products';
import ProductDetail from '@/components/ProductDetail';
import NeonButton from '@/components/NeonButton';

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug: propSlug }: ProductDetailClientProps) {
  // Always prefer the live URL slug so any HTML shell works for any product
  const params = useParams();
  const slug = (params?.slug as string) || propSlug;
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch('https://annoyingkids.com/api/products')
      .then(async (res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data: { products: Product[] }) => {
        const products = data.products ?? MOCK_PRODUCTS;
        setAllProducts(products);
        const found = products.find((p) => p.slug === slug);
        if (found) {
          setProduct(found);
        } else {
          const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
          if (mock) setProduct(mock);
          else setNotFound(true);
        }
      })
      .catch(() => {
        const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (mock) setProduct(mock);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-4 bg-dark-card rounded w-48 animate-pulse" />
        </div>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="aspect-square bg-dark-card border border-dark-border rounded-2xl animate-pulse" />
            <div className="flex flex-col gap-4 pt-8">
              <div className="h-6 bg-dark-card rounded w-24 animate-pulse" />
              <div className="h-10 bg-dark-card rounded w-3/4 animate-pulse" />
              <div className="h-8 bg-dark-card rounded w-32 animate-pulse" />
              <div className="h-24 bg-dark-card rounded animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !product) {
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

  return <ProductDetail product={product} allProducts={allProducts} />;
}
