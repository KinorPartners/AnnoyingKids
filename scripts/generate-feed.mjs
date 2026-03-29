/**
 * Google Merchant Center feed generator.
 * Fetches live Printify products and writes public/feed.xml at build time.
 * GMC should be configured to fetch https://annoyingkids.com/feed.xml on a schedule.
 *
 * Run: node scripts/generate-feed.mjs
 * Called automatically by: npm run build
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://annoyingkids.com';

// Load .env.local if present (for local dev builds)
try {
  const { config } = await import('dotenv');
  config({ path: resolve(__dirname, '../.env.local') });
} catch {
  // dotenv not installed — env vars come from CI/Vercel environment
}

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;

const CATEGORY_MAP = {
  tees:     'Apparel & Accessories > Clothing > Shirts & Tops',
  hoodies:  'Apparel & Accessories > Clothing > Outerwear',
  caps:     'Apparel & Accessories > Clothing Accessories > Hats',
  mugs:     'Home & Garden > Kitchen & Dining > Tableware > Drinkware',
  stickers: 'Arts & Entertainment > Hobby & Creative Arts > Arts & Crafts > Art & Crafting Materials > Craft Decoration Stickers',
};

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function detectCategory(product) {
  const title = product.title.toLowerCase();
  const tags = (product.tags || []).map(t => t.toLowerCase());
  if (tags.includes('hoodie') || title.includes('hoodie')) return 'hoodies';
  if (tags.includes('cap') || tags.includes('hat') || title.includes('cap')) return 'caps';
  if (tags.includes('mug') || title.includes('mug')) return 'mugs';
  if (tags.includes('sticker') || title.includes('sticker')) return 'stickers';
  return 'tees';
}

function buildSlug(product) {
  return product.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getDefaultImage(product) {
  const def = product.images?.find(i => i.is_default);
  return def ? def.src : product.images?.[0]?.src ?? '';
}

function getVariantImage(product, variantId) {
  const img = product.images?.find(i => i.variant_ids?.includes(variantId));
  return img ? img.src : getDefaultImage(product);
}

async function fetchPrintifyProducts() {
  if (!PRINTIFY_API_KEY || !PRINTIFY_SHOP_ID) {
    console.log('[feed] PRINTIFY_API_KEY or PRINTIFY_SHOP_ID not set — skipping live fetch, using empty list');
    return [];
  }

  const res = await fetch(
    `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json`,
    { headers: { Authorization: `Bearer ${PRINTIFY_API_KEY}` } }
  );

  if (!res.ok) {
    console.warn(`[feed] Printify API returned ${res.status} — skipping feed generation`);
    return [];
  }

  const data = await res.json();
  return data.data ?? [];
}

function buildFeedItems(products) {
  const items = [];

  for (const product of products) {
    const category = detectCategory(product);
    const googleCategory = CATEGORY_MAP[category];
    const slug = buildSlug(product);
    const productUrl = `${SITE_URL}/products/${slug}`;
    const description = escapeXml(stripHtml(product.description || product.title).slice(0, 5000));
    const enabledVariants = product.variants.filter(v => v.is_enabled && v.is_available);
    const hasVariants = enabledVariants.length > 1;

    for (const variant of enabledVariants) {
      const price = (variant.price / 100).toFixed(2);
      const imageUrl = getVariantImage(product, variant.id) || getDefaultImage(product);

      // Parse "Color / Size" title (e.g. "Pink / S")
      const parts = variant.title.split('/').map(p => p.trim());
      const hasColorSize = parts.length === 2;
      const color = hasColorSize ? parts[0] : null;
      const size  = hasColorSize ? parts[1] : null;

      const id = hasVariants
        ? `ak-${product.id}-${variant.id}`
        : `ak-${product.id}`;

      let item = `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(product.title)}${color ? ` - ${color}` : ''}${size ? ` ${size}` : ''}</g:title>
      <g:description>${description}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${price} USD</g:price>
      <g:brand>AnnoyingKids</g:brand>
      <g:google_product_category>${googleCategory}</g:google_product_category>`;

      if (hasVariants) {
        item += `\n      <g:item_group_id>ak-${escapeXml(product.id)}</g:item_group_id>`;
      }
      if (color) item += `\n      <g:color>${escapeXml(color)}</g:color>`;
      if (size)  item += `\n      <g:size>${escapeXml(size)}</g:size>`;

      // Age group & gender targeting
      item += `\n      <g:age_group>kids</g:age_group>`;
      item += `\n      <g:gender>unisex</g:gender>`;

      item += `\n    </item>`;
      items.push(item);
    }
  }

  return items;
}

async function main() {
  console.log('[feed] Fetching Printify products...');
  const products = await fetchPrintifyProducts();
  console.log(`[feed] Got ${products.length} products`);

  if (products.length === 0) {
    console.log('[feed] No products — writing empty feed');
  }

  const items = buildFeedItems(products);
  console.log(`[feed] Generated ${items.length} feed items`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AnnoyingKids — Merch for Professional Troublemakers</title>
    <link>${SITE_URL}</link>
    <description>Bold, loud merch for kids 6-16. Annoying by design, awesome by default.</description>
${items.join('\n')}
  </channel>
</rss>`;

  const outPath = resolve(__dirname, '../public/feed.xml');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, xml, 'utf8');
  console.log(`[feed] Written to ${outPath}`);
}

main().catch(err => {
  console.error('[feed] Error:', err.message);
  // Don't exit 1 — a missing feed shouldn't break the build
});
