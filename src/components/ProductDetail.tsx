'use client';

import React, { useState, useMemo, useRef } from 'react';
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

// Strip HTML tags from a string (Printify descriptions contain raw HTML)
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Image helpers — group images by color using Printify variant_ids mapping
// ---------------------------------------------------------------------------

/** Detect if variant format is "size / color" (e.g. mugs: "11oz / Black") */
function variantColorIndex(variants: Product['variants']): number {
  if (variants.length === 0 || !variants[0].title.includes('/')) return 0;
  const first = variants[0].title.split('/')[0].trim().toLowerCase();
  return /^\d+\s*oz$/.test(first) ? 1 : 0;
}

function extractColor(title: string, colorIdx: number): string {
  return title.split('/')[colorIdx]?.trim() || '';
}

/** Get all images that belong to a specific color, using imageData variant_ids */
function getImagesForColor(product: Product, color: string): string[] {
  const { imageData, variants, images } = product;
  if (!imageData || imageData.length === 0) {
    return [getImageForVariantLegacy(product, color)].filter(Boolean) as string[];
  }

  const colorLower = color.toLowerCase();
  const cIdx = variantColorIndex(variants);
  const colorVariantIds = new Set(
    variants
      .filter(v => extractColor(v.title, cIdx).toLowerCase() === colorLower)
      .map(v => parseInt(v.id, 10))
      .filter(n => !isNaN(n))
  );

  const matched: string[] = [];
  for (const img of imageData) {
    if (img.variant_ids.some(vid => colorVariantIds.has(vid))) {
      matched.push(img.src);
    }
  }

  if (matched.length > 0) return matched;

  return [getImageForVariantLegacy(product, color)].filter(Boolean) as string[];
}

/** Get images NOT belonging to the selected color (other colors + lifestyle) */
function getOtherImages(product: Product, selectedColor: string): string[] {
  const { imageData, images, variants } = product;
  if (!imageData || imageData.length === 0) return images.slice(1);

  const selectedLower = selectedColor.toLowerCase();
  const cIdx = variantColorIndex(variants);
  const selectedVariantIds = new Set(
    variants
      .filter(v => extractColor(v.title, cIdx).toLowerCase() === selectedLower)
      .map(v => parseInt(v.id, 10))
      .filter(n => !isNaN(n))
  );

  return imageData
    .filter(img => !img.variant_ids.some(vid => selectedVariantIds.has(vid)))
    .map(img => img.src);
}

/** Legacy single-image matching for products without imageData */
function getImageForVariantLegacy(product: Product, color: string): string | null {
  const { images, variants } = product;
  if (!images.length) return null;
  const colorLower = color.toLowerCase();

  // URL-based: extract Printify variant ID from URL segment
  const urlVariantId = (url: string): string | null => {
    try { const seg = url.split('/')[5]; return seg && /^\d+$/.test(seg) ? seg : null; } catch { return null; }
  };

  const cIdx = variantColorIndex(variants);

  for (const img of images) {
    const uvid = urlVariantId(img);
    if (!uvid) continue;
    const imgVariant = variants.find(v => v.id === uvid);
    if (imgVariant && extractColor(imgVariant.title, cIdx).toLowerCase() === colorLower) return img;
  }

  // Proximity match
  const colorIds = variants.filter(v => extractColor(v.title, cIdx).toLowerCase() === colorLower)
    .map(v => parseInt(v.id, 10)).filter(n => !isNaN(n));
  if (colorIds.length > 0) {
    let bestImg: string | null = null;
    let bestDiff = Infinity;
    for (const img of images) {
      const uvid = urlVariantId(img);
      const unum = parseInt(uvid ?? '', 10);
      if (isNaN(unum)) continue;
      const diff = Math.min(...colorIds.map(id => Math.abs(id - unum)));
      if (diff < bestDiff) { bestDiff = diff; bestImg = img; }
    }
    if (bestImg && bestDiff < 500) return bestImg;
  }

  // Color index fallback
  const seenColors: string[] = [];
  for (const v of variants) {
    const c = extractColor(v.title, cIdx).toLowerCase();
    if (!seenColors.includes(c)) seenColors.push(c);
  }
  const colorIdx = seenColors.indexOf(colorLower);
  return images[colorIdx >= 0 ? colorIdx : 0] || images[0];
}

const SIZE_GUIDE: Record<string, { headers: string[]; rows: string[][] }> = {
  tees: {
    headers: ['Size', 'Chest (in)', 'Length (in)'],
    rows: [['XS','30–32','26'],['S','34–36','27'],['M','38–40','28'],['L','42–44','29'],['XL','46–48','30'],['2XL','50–52','31'],['3XL','54–56','32']],
  },
  hoodies: {
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
    rows: [['XS','32–34','24','32'],['S','36–38','25','33'],['M','40–42','26','34'],['L','44–46','27','35'],['XL','48–50','28','36'],['2XL','52–54','29','37'],['3XL','56–58','30','38']],
  },
  caps: {
    headers: ['Style', 'Circumference'],
    rows: [['One Size (adjustable)', '21–23 in / 53–58 cm']],
  },
  mugs: {
    headers: ['Size', 'Volume', 'Height'],
    rows: [['11oz','325 ml','3.8 in'],['15oz','444 ml','4.7 in']],
  },
};

export default function ProductDetail({ product, allProducts }: ProductDetailProps) {
  const { addItem } = useCart();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const sizeGuide = SIZE_GUIDE[product.category];

  // Parse variants into color + size dimensions if applicable
  const hasColorSize = product.variants.length > 0 && product.variants[0].title.includes('/');

  // Detect if variant format is "size / color" (e.g. mugs: "11oz / Black") vs "color / size"
  const isSwapped = useMemo(() => {
    if (!hasColorSize) return false;
    const first = product.variants[0].title.split('/')[0].trim().toLowerCase();
    return /^\d+\s*oz$/.test(first) || /^\d+[""]\s*[×x×]\s*\d+/.test(first);
  }, [product.variants, hasColorSize]);

  // Extract color (index 0 normally, index 1 if swapped) and size (vice versa)
  const getColor = (title: string) => title.split('/')[isSwapped ? 1 : 0]?.trim() || '';
  const getSize = (title: string) => title.split('/')[isSwapped ? 0 : 1]?.trim() || '';

  const uniqueColors = useMemo(() => {
    if (!hasColorSize) return [];
    const seen: string[] = [];
    for (const v of product.variants) {
      const c = getColor(v.title);
      if (!seen.includes(c)) seen.push(c);
    }
    return seen;
  }, [product.variants, hasColorSize, isSwapped]);

  const uniqueSizes = useMemo(() => {
    if (!hasColorSize) return [];
    const SIZE_ORDER = ['11oz','15oz','3"×3"','4"×4"','6"×6"','One size','One Size','XS','S','M','L','XL','2XL','3XL','4XL','5XL','6XL','7XL'];
    const seen: string[] = [];
    for (const v of product.variants) {
      const s = getSize(v.title);
      if (s && !seen.includes(s)) seen.push(s);
    }
    return seen.sort((a, b) => {
      const ai = SIZE_ORDER.findIndex(s => s.toLowerCase() === a.toLowerCase());
      const bi = SIZE_ORDER.findIndex(s => s.toLowerCase() === b.toLowerCase());
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [product.variants, hasColorSize, isSwapped]);

  const [selectedColor, setSelectedColor] = useState(() => {
    if (!hasColorSize) return '';
    // Pre-select color from ?color= URL param if present and valid
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('color');
      if (param) {
        const match = product.variants.find(v => getColor(v.title) === param);
        if (match) return param;
      }
    }
    return getColor(product.variants[0].title);
  });
  const [selectedSize, setSelectedSize] = useState(() =>
    hasColorSize ? getSize(product.variants[0].title) : ''
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const otherCarouselRef = useRef<HTMLDivElement>(null);
  const [descExpanded, setDescExpanded] = useState(false);

  // Sync color+size selection back to variantIndex
  const syncVariant = (color: string, size: string) => {
    const title = isSwapped ? `${size} / ${color}` : `${color} / ${size}`;
    const idx = product.variants.findIndex(v => v.title === title);
    setSelectedVariantIndex(idx >= 0 ? idx : 0);
    setImgError(false);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Pick first available size for this color, or keep current if valid
    const sizesForColor = product.variants
      .filter(v => getColor(v.title) === color)
      .map(v => getSize(v.title));
    const newSize = sizesForColor.includes(selectedSize) ? selectedSize : sizesForColor[0] || '';
    setSelectedSize(newSize);
    syncVariant(color, newSize);
    setActiveImageIndex(0);
    setImgError(false);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    syncVariant(selectedColor, size);
  };

  const selectedVariant = product.variants[selectedVariantIndex];

  // Strip HTML from description, then truncate by words
  const plainDesc = stripHtml(product.description);
  const descWords = plainDesc.split(' ').filter(Boolean);
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

  // Compute color-filtered images
  const colorImages = useMemo(() => {
    if (hasColorSize && selectedColor) {
      return getImagesForColor(product, selectedColor);
    }
    return product.images;
  }, [product, selectedColor, hasColorSize]);

  const otherImages = useMemo(() => {
    if (hasColorSize && selectedColor) {
      return getOtherImages(product, selectedColor);
    }
    return [];
  }, [product, selectedColor, hasColorSize]);

  const primaryImage = colorImages[activeImageIndex] || colorImages[0] || product.images[0];

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
          {/* Product Image Gallery */}
          <div className="relative space-y-3">
            {/* Main Image */}
            <div className="aspect-square bg-dark-card border border-dark-border rounded-2xl overflow-hidden flex items-center justify-center relative group">
              {primaryImage && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage}
                  alt={`${product.title}${selectedColor ? ` - ${selectedColor}` : ''}`}
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

            {/* Thumbnail strip for selected color */}
            {colorImages.length > 1 && (
              <div className="relative">
                <div
                  ref={thumbnailRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {colorImages.map((img, idx) => (
                    <button
                      key={img + idx}
                      onClick={() => { setActiveImageIndex(idx); setImgError(false); }}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeImageIndex === idx
                          ? 'border-neon-pink shadow-[0_0_10px_rgba(255,45,120,0.4)]'
                          : 'border-dark-border hover:border-neon-pink/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${product.title} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary carousel: other colors & lifestyle images */}
            {otherImages.length > 0 && (
              <div className="mt-4">
                <p className="font-space text-xs text-gray-600 uppercase tracking-wider mb-2">
                  All Colors &amp; Views
                </p>
                <div className="relative">
                  <div
                    ref={otherCarouselRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {otherImages.map((img, idx) => (
                      <button
                        key={img + idx}
                        onClick={() => {
                          // When clicking another color's image, try to find and select that color
                          if (product.imageData) {
                            const imgData = product.imageData.find(d => d.src === img);
                            if (imgData && imgData.variant_ids.length > 0) {
                              const matchingVariant = product.variants.find(v =>
                                imgData.variant_ids.includes(parseInt(v.id, 10))
                              );
                              if (matchingVariant) {
                                const newColor = getColor(matchingVariant.title);
                                if (newColor !== selectedColor) {
                                  handleColorSelect(newColor);
                                  return;
                                }
                              }
                            }
                          }
                          // Fallback: just show this image
                          setImgError(false);
                        }}
                        className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-dark-border
                          hover:border-neon-blue/40 opacity-60 hover:opacity-100 transition-all duration-200"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`${product.title} alternate view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                {hasLongDesc && !descExpanded ? shortDesc + '…' : plainDesc}
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
              hasColorSize ? (
                <div className="mb-8 space-y-5">
                  {/* Color picker */}
                  {uniqueColors.length > 0 && (
                    <div>
                      <label className="font-bungee text-sm text-gray-400 mb-3 block">
                        Color: <span className="text-neon-pink">{selectedColor}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            className={`px-4 py-2 rounded-lg font-space text-sm transition-all duration-300 ${
                              selectedColor === color
                                ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,45,120,0.4)] border border-neon-pink'
                                : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-pink/30'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Size picker */}
                  {uniqueSizes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="font-bungee text-sm text-gray-400">
                          Size: <span className="text-neon-blue">{selectedSize}</span>
                        </label>
                        {sizeGuide && (
                          <button
                            onClick={() => setSizeGuideOpen(true)}
                            className="font-space text-xs text-gray-500 hover:text-neon-blue underline transition-colors"
                          >
                            Size guide
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map((size) => {
                          const variantTitle = isSwapped ? `${size} / ${selectedColor}` : `${selectedColor} / ${size}`;
                          const matchingVariant = product.variants.find(
                            v => v.title === variantTitle
                          );
                          const available = matchingVariant?.isAvailable ?? false;
                          return (
                            <button
                              key={size}
                              onClick={() => handleSizeSelect(size)}
                              disabled={!available}
                              className={`px-4 py-2 rounded-lg font-space text-sm transition-all duration-300 ${
                                selectedSize === size
                                  ? 'bg-neon-blue text-dark-bg shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-neon-blue'
                                  : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-blue/30'
                              } ${!available ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
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
                        } ${!variant.isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* SKU */}
            {selectedVariant && (
              <div className="mb-6 flex items-center gap-2">
                <span className="font-space text-gray-600 text-xs uppercase tracking-wider">SKU:</span>
                <span className="font-space text-gray-400 text-xs font-mono bg-dark-surface border border-dark-border rounded px-2 py-0.5">
                  {selectedVariant.id}
                </span>
                <span className="font-space text-gray-600 text-xs">{selectedVariant.title}</span>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="font-bungee text-sm text-gray-400 mb-3 mt-2 block">
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
              {['🚚 US & Intl Shipping', '🔄 30-Day Returns', '🔒 Secure Checkout'].map((badge) => (
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

      {/* Size guide modal */}
      {sizeGuideOpen && sizeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSizeGuideOpen(false)}
        >
          <div
            className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-lg w-full shadow-[0_0_40px_rgba(0,240,255,0.15)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bungee text-white text-xl">Size Guide</h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-dark-surface hover:bg-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-space text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    {sizeGuide.headers.map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-gray-400 font-bold uppercase text-xs tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.rows.map((row, i) => (
                    <tr key={i} className="border-b border-dark-border/40 hover:bg-dark-surface/50">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-2 pr-4 ${j === 0 ? 'font-bold text-neon-blue' : 'text-gray-300'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-space text-gray-600 text-xs mt-4">Measurements are approximate. When in doubt, size up.</p>
          </div>
        </div>
      )}
    </div>
  );
}
