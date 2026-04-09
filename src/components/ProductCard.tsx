'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

/** Map color names (lowercase) to display hex values */
const COLOR_HEX: Record<string, string> = {
  'white':       '#FFFFFF',
  'black':       '#1a1a1a',
  'sand':        '#C2A96E',
  'sport grey':  '#8A8A8A',
  'navy':        '#1C2D5A',
  'red':         '#CC2222',
  'royal blue':  '#1C47A3',
  'forest green':'#2D6A2D',
  'maroon':      '#7B1E1E',
  'purple':      '#6B2FA0',
  'gold':        '#C9A227',
  'light blue':  '#7EC8E3',
  'charcoal':    '#3D3D3D',
  'heather grey':'#B0B0B0',
  'ash grey':    '#B0B0B0',
};

/** Extract unique colors from product variants. Returns [] for size-only products. */
function getProductColors(product: Product): string[] {
  if (!product.variants.length) return [];
  const first = product.variants[0].title;
  if (!first.includes('/')) return [];
  // Detect swapped format: "Size / Color" (e.g. "11oz / Black")
  const isSwapped = /^\d+\s*oz$/.test(first.split('/')[0].trim().toLowerCase());
  const seen = new Set<string>();
  const colors: string[] = [];
  for (const v of product.variants) {
    const parts = v.title.split('/');
    const color = (isSwapped ? parts[1] : parts[0])?.trim();
    if (color && !seen.has(color)) {
      seen.add(color);
      colors.push(color);
    }
  }
  return colors;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const productColors = getProductColors(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    if (defaultVariant) {
      addItem(product, defaultVariant, 1);
    }
  };

  const categoryColors: Record<string, string> = {
    tees: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
    hoodies: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
    mugs: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
    stickers: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    caps: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const categoryEmoji: Record<string, string> = {
    tees: '👕', hoodies: '🧥', mugs: '☕', stickers: '🎨', caps: '🧢',
  };

  const primaryImage = !imgError && product.images[0] ? product.images[0] : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-neon-pink/50 hover:shadow-[0_0_30px_rgba(255,45,120,0.2)]">
        {/* Product image */}
        <div className="relative aspect-square bg-dark-surface overflow-hidden">
          {primaryImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={primaryImage}
                alt={product.title}
                width={800}
                height={800}
                onError={() => setImgError(true)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${
                      product.category === 'tees' ? '#ff2d78'
                      : product.category === 'hoodies' ? '#00f0ff'
                      : product.category === 'mugs' ? '#fff200'
                      : product.category === 'stickers' ? '#39ff14'
                      : '#a855f7'
                    } 0%, transparent 70%)`,
                    width: '200px', height: '200px',
                    transform: 'translate(-50%, -50%)',
                    top: '50%', left: '50%',
                  }}
                />
                <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {categoryEmoji[product.category] || '📦'}
                </span>
              </div>
            </div>
          )}

          {/* Glitch overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,45,120,0.03) 2px, rgba(255,45,120,0.03) 4px)',
              }}
            />
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-3 py-1 rounded-full text-xs font-space font-bold uppercase tracking-wider border ${
                categoryColors[product.category] || 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* Product info */}
        <div className="p-5">
          <h3 className="font-bungee text-white text-sm mb-2 group-hover:text-neon-pink transition-colors duration-300 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-space text-neon-green font-bold text-lg">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.title} to cart`}
              className="px-4 py-2 bg-neon-pink/10 border border-neon-pink/30 rounded-lg text-neon-pink text-xs font-bungee uppercase
                hover:bg-neon-pink hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,45,120,0.5)]"
            >
              Add to Cart
            </button>
          </div>
          {productColors.length > 0 ? (
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              {productColors.map((color) => {
                const hex = COLOR_HEX[color.toLowerCase()] ?? '#888888';
                const isWhite = hex === '#FFFFFF';
                return (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/products/${product.slug}?color=${encodeURIComponent(color)}`);
                    }}
                    title={color}
                    aria-label={`View in ${color}`}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: hex,
                      border: `2px solid ${isWhite ? 'rgba(180,180,180,0.9)' : 'rgba(255,255,255,0.3)'}`,
                      cursor: 'pointer',
                      transition: 'transform 0.2s, border-color 0.2s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = isWhite ? 'rgba(180,180,180,0.9)' : 'rgba(255,255,255,0.3)';
                    }}
                  />
                );
              })}
            </div>
          ) : product.variants.length > 1 && (
            <p className="text-gray-500 text-xs font-space mt-2">
              {product.variants.length} options available
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
