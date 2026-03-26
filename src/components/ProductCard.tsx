'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

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

  const primaryImage = product.images[0] || null;
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Catch images already loaded from cache (onLoad won't fire for those)
  useEffect(() => {
    if (imgRef.current?.complete && !imgRef.current.naturalWidth) {
      setImgError(true);
    } else if (imgRef.current?.complete) {
      setImgLoaded(true);
    }
  }, []);

  const categoryEmoji: Record<string, string> = {
    tees: '👕', hoodies: '🧥', mugs: '☕', stickers: '🎨', caps: '🧢',
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-neon-pink/50 hover:shadow-[0_0_30px_rgba(255,45,120,0.2)]">
        {/* Product image */}
        <div className="relative aspect-square bg-dark-surface overflow-hidden">
          {primaryImage && !imgError ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-dark-surface to-dark-card animate-pulse" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={primaryImage}
                alt={product.title}
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
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
              className="px-4 py-2 bg-neon-pink/10 border border-neon-pink/30 rounded-lg text-neon-pink text-xs font-bungee uppercase
                hover:bg-neon-pink hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,45,120,0.5)]"
            >
              Add to Cart
            </button>
          </div>
          {product.variants.length > 1 && (
            <p className="text-gray-500 text-xs font-space mt-2">
              {product.variants.length} options available
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
