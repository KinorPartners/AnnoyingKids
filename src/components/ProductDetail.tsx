'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getRelatedProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import NeonButton from '@/components/NeonButton';
import ShareButton from '@/components/ShareButton';

interface ProductDetailProps {
  product: Product;
  allProducts?: Product[];
}

const categoryEmoji: Record<string, string> = {
  tees: '👕',
  hoodies: '🧥',
  mugs: '☕',
  stickers: '🎨',
  caps: '🧢',
};

export default function ProductDetail({ product, allProducts }: ProductDetailProps) {
  const { addItem } = useCart();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex];

  // Truncate description to ~10 words for the collapsed state
  const descWords = product.description.split(' ');
  const shortDesc = descWords.slice(0, 10).join(' ');
  const hasLongDesc = descWords.length > 10;

  // Use live products for related items if provided, otherwise fall back to static mock
  const relatedProducts = allProducts
    ? allProducts
        .filter(
          (p) => p.slug !== product.slug && p.category === product.category
        )
        .slice(0, 3)
        .concat(
          allProducts
            .filter((p) => p.slug !== product.slug && p.category !== product.category)
            .slice(0, Math.max(0, 3 - allProducts.filter((p) => p.slug !== product.slug && p.category === product.category).length))
        )
        .slice(0, 3)
    : getRelatedProducts(product.slug, 3);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Show the image matching the selected variant index (if available), otherwise first image
  const primaryImage = product.images[selectedVariantIndex] || product.images[0] || null;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 font-space text-sm" aria-label="Breadcrumb">
          <Link href="/" className="text-gray-500 hover:text-neon-pink transition-colors">
            Home
          </Link>
          <span className="text-gray-700">/</span>
          <Link href="/products" className="text-gray-500 hover:text-neon-pink transition-colors">
            Products
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-neon-pink">{product.title}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-dark-card border border-dark-border rounded-2xl overflow-hidden flex items-center justify-center relative group">
              {primaryImage && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage}
                  alt={product.title}
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${
                          product.category === 'tees'
                            ? '#ff2d78'
                            : product.category === 'hoodies'
                            ? '#00f0ff'
                            : product.category === 'mugs'
                            ? '#fff200'
                            : product.category === 'stickers'
                            ? '#39ff14'
                            : '#a855f7'
                        } 0%, transparent 70%)`,
                      }}
                    />
                  </div>
                  <span className="text-[120px] sm:text-[160px] relative z-10 group-hover:scale-110 transition-transform duration-500">
                    {categoryEmoji[product.category] || '📦'}
                  </span>
                </>
              )}

              {/* Scanline overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  background:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
                }}
              />

              {/* Category badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-neon-pink/20 border border-neon-pink/30 rounded-full text-neon-pink text-xs font-bungee uppercase">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <span className="font-space text-neon-green text-sm uppercase tracking-widest">
                {product.category}
              </span>
            </div>

            <h1 className="font-bungee text-3xl sm:text-4xl text-white mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-bungee text-neon-green text-3xl">
                ${selectedVariant.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="font-space text-gray-600 text-lg line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="font-space text-gray-400 leading-relaxed mb-8">
              <span>
                {hasLongDesc && !descExpanded ? shortDesc + '…' : product.description}
              </span>
              {hasLongDesc && (
                <button
                  onClick={() => setDescExpanded(e => !e)}
                  className="ml-2 text-neon-pink text-sm hover:underline focus:outline-none"
                >
                  {descExpanded ? 'See less' : 'See more'}
                </button>
              )}
            </div>

            {/* Variant selector */}
            {product.variants.length > 1 && (
              <div className="mb-8">
                <label className="font-bungee text-sm text-gray-400 mb-3 block">
                  Option
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => { setSelectedVariantIndex(index); setImgError(false); }}
                      disabled={!variant.isAvailable}
                      className={`px-4 py-2 rounded-lg font-space text-sm transition-all duration-300 ${
                        selectedVariantIndex === index
                          ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,45,120,0.4)] border border-neon-pink'
                          : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-pink/30'
                      } ${
                        !variant.isAvailable ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="font-bungee text-sm text-gray-400 mb-3 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center
                    text-gray-400 hover:text-neon-pink hover:border-neon-pink/30 transition-all duration-200"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-space text-white text-lg w-12 text-center font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center
                    text-gray-400 hover:text-neon-green hover:border-neon-green/30 transition-all duration-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 px-8 py-4 font-bungee text-lg uppercase rounded-lg transition-all duration-300
                  hover:scale-[1.02] active:scale-[0.98] ${
                    addedToCart
                      ? 'bg-neon-green text-dark-bg shadow-[0_0_30px_rgba(57,255,20,0.5)]'
                      : 'bg-neon-pink text-white shadow-[0_0_20px_rgba(255,45,120,0.5)] hover:shadow-[0_0_30px_rgba(255,45,120,0.8)]'
                  }`}
              >
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart 🛒'}
              </button>
              <ShareButton
                title={product.title}
                description={product.description}
                url={`https://annoyingkids.com/products/${product.slug}`}
              />
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              {['🚚 Free US Shipping', '🔄 30-Day Returns', '🔒 Secure Checkout'].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 bg-dark-surface border border-dark-border rounded-full text-gray-500 text-xs font-space"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-dark-surface border border-dark-border rounded-full text-gray-600 text-xs font-space"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="font-bungee text-2xl sm:text-3xl text-white">
                More <span className="text-neon-blue">Chaos</span>
              </h2>
              <p className="font-space text-gray-500 mt-2">
                You might also like these troublemaker essentials
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <NeonButton href="/products" variant="blue">
            ← Back to Shop
          </NeonButton>
        </div>
      </section>
    </div>
  );
}
