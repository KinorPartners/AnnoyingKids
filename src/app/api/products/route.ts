import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/products';
import { isPrintifyConfigured, fetchProducts } from '@/lib/printify';
import { Product } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // If Printify is configured, fetch from API
    if (isPrintifyConfigured()) {
      try {
        const printifyProducts = await fetchProducts();

        // Transform Printify products to our format
        const products: Product[] = printifyProducts.map((pp) => ({
          id: pp.id,
          title: pp.title,
          slug: pp.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
          description: pp.description || '',
          price:
            pp.variants.find((v) => v.is_enabled && v.is_available)?.price
              ? (pp.variants.find((v) => v.is_enabled && v.is_available)!.price) / 100
              : 0,
          category: 'tees', // Default category; could be improved with tags
          images: pp.images
            .filter((img) => img.is_default)
            .map((img) => img.src),
          variants: pp.variants
            .filter((v) => v.is_enabled)
            .map((v) => ({
              id: String(v.id),
              title: v.title,
              price: v.price / 100,
              isAvailable: v.is_available,
            })),
          tags: pp.tags || [],
        }));

        return NextResponse.json({ products, source: 'printify' });
      } catch (printifyError) {
        console.error('Printify API error, falling back to mock data:', printifyError);
        // Fall through to mock data
      }
    }

    // Return mock data as fallback
    return NextResponse.json({
      products: MOCK_PRODUCTS,
      source: 'mock',
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
