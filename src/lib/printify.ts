/**
 * Printify API client — server-only, used at build time.
 * Never import this from client components.
 */
import { Product, ProductImage, PrintifyProduct, PrintifyVariant } from '@/types';

const API_BASE = 'https://api.printify.com/v1';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inferCategory(tags: string[], title: string): Product['category'] {
  const text = [...tags, title].join(' ').toLowerCase();
  if (text.includes('mug') || text.includes('cup') || text.includes('tumbler')) return 'mugs';
  if (text.includes('sticker') || text.includes('decal')) return 'stickers';
  if (text.includes('cap') || text.includes('hat') || text.includes('beanie') || text.includes('snapback')) return 'caps';
  if (
    text.includes('hoodie') || text.includes('sweatshirt') || text.includes('pullover') ||
    text.includes('crewneck') || text.includes('fleece') || text.includes('zip-up')
  ) return 'hoodies';
  return 'tees';
}

export function printifyToProduct(p: PrintifyProduct): Product {
  const enabled: PrintifyVariant[] = p.variants.filter(v => v.is_enabled && v.is_available);
  const prices = enabled.map(v => v.price / 100);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const defaultImgs = p.images.filter(img => img.is_default);
  const frontImgs   = p.images.filter(img => img.position === 'front' && !img.is_default);
  const restImgs    = p.images.filter(img => !img.is_default && img.position !== 'front');
  const orderedPrintifyImages = [...defaultImgs, ...frontImgs, ...restImgs];
  const images = orderedPrintifyImages.map(img => img.src);

  // Preserve rich image data for color-based gallery filtering
  const imageData: ProductImage[] = orderedPrintifyImages.map(img => ({
    src: img.src,
    variant_ids: img.variant_ids,
    position: img.position,
    is_default: img.is_default,
  }));

  const description = p.description
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    id: p.id,
    title: p.title,
    slug: slugify(p.title),
    description,
    price: minPrice,
    category: inferCategory(p.tags, p.title),
    images: images.length > 0 ? images : ['/products/hoodie-placeholder.svg'],
    imageData: imageData.length > 0 ? imageData : undefined,
    variants: enabled.map(v => ({
      id: String(v.id),
      title: v.title,
      price: v.price / 100,
      isAvailable: v.is_available,
    })),
    tags: p.tags,
  };
}

export async function fetchPrintifyProducts(): Promise<Product[]> {
  const token  = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token || !shopId) {
    console.warn('[Printify] PRINTIFY_API_KEY or PRINTIFY_SHOP_ID not set — falling back to static products');
    return [];
  }

  const products: Product[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${API_BASE}/shops/${shopId}/products.json?limit=100&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'force-cache' }
    );

    if (!res.ok) {
      console.error(`[Printify] API returned ${res.status} on page ${page}`);
      break;
    }

    const data = await res.json();
    const raw: PrintifyProduct[] = data.data ?? [];

    products.push(
      ...raw
        .filter(p => p.variants.some(v => v.is_enabled && v.is_available))
        .map(printifyToProduct)
    );

    if (raw.length < 100) break;
    page++;
  }

  console.log(`[Printify] Loaded ${products.length} products from shop ${shopId}`);
  return products;
}
