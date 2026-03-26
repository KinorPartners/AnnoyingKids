'use client';

import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/products';

// Products are now loaded from Printify at build time via server components.
// This hook returns the static fallback list and is kept for any legacy usage.
export function useProducts(): { products: Product[]; loading: boolean; error: string | null; source: 'live' | 'mock' } {
  return { products: MOCK_PRODUCTS, loading: false, error: null, source: 'mock' };
}
