'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import GlitchText from '@/components/GlitchText';
import { MOCK_PRODUCTS, CATEGORIES, getProductsByCategory } from '@/lib/products';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filteredProducts = useMemo(() => {
    let products = getProductsByCategory(selectedCategory);

    if (sortBy === 'price-asc') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products = [...products].sort((a, b) => b.price - a.price);
    }

    return products;
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">
            Browse the Collection
          </span>
          <div className="mt-4">
            <GlitchText
              text="THE CHAOS SHOP"
              as="h1"
              className="font-bungee text-4xl sm:text-5xl md:text-6xl text-white"
            />
          </div>
          <p className="font-space text-gray-500 mt-4 max-w-xl mx-auto">
            Every piece designed to turn heads, raise eyebrows, and make your parents
            question their life choices.
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-dark-border">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-space text-sm transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,45,120,0.4)]'
                    : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-pink/30 hover:text-neon-pink'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 font-space text-sm text-gray-400
              focus:outline-none focus:border-neon-pink/30 transition-all duration-300 cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Product count */}
        <p className="font-space text-gray-600 text-sm mb-6">
          Showing{' '}
          <span className="text-neon-green font-bold">{filteredProducts.length}</span>{' '}
          product{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 inline-block">🤷</span>
            <h3 className="font-bungee text-xl text-gray-400 mb-2">No Products Found</h3>
            <p className="font-space text-gray-600">
              Try a different category or check back for new drops!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
