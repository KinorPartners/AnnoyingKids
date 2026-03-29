/**
 * Pre-build: fetch Printify products, download primary images to public/product-images/,
 * write public/products-cache.json with local image paths.
 *
 * Run:  node scripts/fetch-products.mjs
 * Called automatically by: npm run build
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local if present (for local dev)
try {
  const { config } = await import('dotenv');
  config({ path: resolve(__dirname, '../.env.local') });
} catch {}

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const IMG_DIR    = resolve(__dirname, '../public/product-images');
const CACHE_PATH = resolve(__dirname, '../public/products-cache.json');

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function inferCategory(tags, title) {
  const text = [...(tags || []), title].join(' ').toLowerCase();
  if (text.includes('mug') || text.includes('cup') || text.includes('tumbler')) return 'mugs';
  if (text.includes('sticker') || text.includes('decal')) return 'stickers';
  if (text.includes('cap') || text.includes('hat') || text.includes('beanie') || text.includes('snapback')) return 'caps';
  if (text.includes('hoodie') || text.includes('sweatshirt') || text.includes('pullover') ||
      text.includes('crewneck') || text.includes('fleece') || text.includes('zip-up')) return 'hoodies';
  return 'tees';
}

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json?limit=100&page=${page}`,
      { headers: { Authorization: `Bearer ${PRINTIFY_API_KEY}` } }
    );
    if (!res.ok) throw new Error(`Printify API ${res.status} on page ${page}`);
    const data = await res.json();
    const raw = data.data ?? [];
    products.push(...raw);
    if (raw.length < 100) break;
    page++;
  }
  return products;
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = await res.arrayBuffer();
  writeFileSync(dest, Buffer.from(buf));
}

async function main() {
  if (!PRINTIFY_API_KEY || !PRINTIFY_SHOP_ID) {
    console.log('[products] No Printify credentials — skipping cache update');
    return;
  }

  console.log('[products] Fetching products from Printify...');
  const raw = await fetchAllProducts();
  console.log(`[products] Got ${raw.length} products`);

  mkdirSync(IMG_DIR, { recursive: true });

  const products = [];

  for (const p of raw) {
    const enabled = p.variants.filter(v => v.is_enabled && v.is_available);
    if (enabled.length === 0) continue;

    const slug = slugify(p.title);

    // Collect CDN image URLs (default first, then front, then rest)
    const defaultImgs = p.images.filter(i => i.is_default).map(i => i.src);
    const frontImgs   = p.images.filter(i => i.position === 'front' && !i.is_default).map(i => i.src);
    const restImgs    = p.images.filter(i => !i.is_default && i.position !== 'front').map(i => i.src);
    const cdnImages   = [...defaultImgs, ...frontImgs, ...restImgs];

    // Download primary image locally; keep remaining as CDN URLs
    const images = [];
    if (cdnImages.length > 0) {
      const ext      = cdnImages[0].toLowerCase().includes('.png') ? 'png' : 'jpg';
      const filename = `${slug}.${ext}`;
      const dest     = resolve(IMG_DIR, filename);
      try {
        if (!existsSync(dest)) {
          await downloadImage(cdnImages[0], dest);
          console.log(`  ✓ ${filename}`);
        } else {
          console.log(`  · ${filename} (cached)`);
        }
        images.push(`/product-images/${filename}`);
      } catch (err) {
        console.warn(`  ✗ ${slug}: ${err.message} — keeping CDN URL`);
        images.push(cdnImages[0]);
      }
      // Remaining images stay as CDN URLs (detail page only)
      for (let i = 1; i < cdnImages.length; i++) images.push(cdnImages[i]);
    } else {
      images.push('/products/hoodie-placeholder.svg');
    }

    const prices = enabled.map(v => v.price / 100);
    const description = (p.description || p.title)
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    products.push({
      id: p.id,
      title: p.title,
      slug,
      description,
      price: Math.min(...prices),
      category: inferCategory(p.tags, p.title),
      images,
      variants: enabled.map(v => ({
        id: String(v.id),
        title: v.title,
        price: v.price / 100,
        isAvailable: v.is_available,
      })),
      tags: p.tags || [],
    });
  }

  writeFileSync(CACHE_PATH, JSON.stringify(products, null, 2), 'utf8');
  console.log(`[products] Cached ${products.length} products → products-cache.json`);
}

main().catch(err => {
  console.error('[products] Fatal:', err.message);
  // Do not exit 1 — build continues with existing cache or API fallback
});
