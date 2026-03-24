'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/products';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  source: 'live' | 'mock';
}

const CACHE_KEY = 'ak-products-cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  products: Product[];
  timestamp: number;
}

function readCache(): Product[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.products;
  } catch {
    return null;
  }
}

function writeCache(products: Product[]) {
  try {
    const entry: CacheEntry = { products, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // sessionStorage may be unavailable in some contexts — silently skip
  }
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  // Start false — MOCK_PRODUCTS is available immediately; live fetch updates in background
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setProducts(cached);
      setSource('live');
      return;
    }

    fetch('/api/products')
      .then(async (res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data: { products: Product[]; source: string }) => {
        if (data.products && data.products.length > 0) {
          writeCache(data.products);
          setProducts(data.products);
          setSource(data.source === 'printify' ? 'live' : 'mock');
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return { products, loading, error, source };
}
