const PRINTIFY_API_BASE = 'https://api.printify.com/v1';

const MOCK_PRODUCTS = [
  {
    id: 'prod_anime_ramen_mug',
    title: 'Anime Girl Ramen Mug',
    slug: 'anime-girl-ramen-mug',
    description:
      "Fuel your chaos with ramen and anime energy. This 11oz ceramic mug features a vibrant anime girl slurping ramen — because every main character needs proper fuel. Microwave and dishwasher safe.",
    price: 15.99,
    category: 'mugs',
    images: ['/products/mug-placeholder.svg'],
    variants: [
      { id: 'var_mug_11oz', title: '11oz', price: 15.99, isAvailable: true },
      { id: 'var_mug_15oz', title: '15oz', price: 18.99, isAvailable: true },
    ],
    tags: ['anime', 'ramen', 'mug', 'drinkware'],
  },
  {
    id: 'prod_glitched_stickers',
    title: 'Glitched Neon Visage Stickers',
    slug: 'glitched-neon-visage-stickers',
    description:
      'Stick your chaos everywhere. High-quality vinyl stickers with a glitched-out neon portrait. Waterproof, scratch-resistant, built to survive a school backpack.',
    price: 2.41,
    category: 'stickers',
    images: ['/products/sticker-placeholder.svg'],
    variants: [
      { id: 'var_sticker_3x3', title: '3 x 3 in', price: 2.41, isAvailable: true },
      { id: 'var_sticker_4x4', title: '4 x 4 in', price: 3.99, isAvailable: true },
      { id: 'var_sticker_6x6', title: '6 x 6 in', price: 5.99, isAvailable: true },
    ],
    tags: ['stickers', 'neon', 'glitch', 'vinyl'],
  },
  {
    id: 'prod_fractal_hoodie',
    title: 'Glitched Portrait Fractal Hoodie',
    slug: 'glitched-portrait-fractal-hoodie',
    description:
      "Wrap yourself in digital chaos. Premium hoodie with an all-over glitched fractal portrait. Ultra-soft fleece interior, kangaroo pocket, hood big enough to disappear into.",
    price: 35.83,
    category: 'hoodies',
    images: ['/products/hoodie-placeholder.svg'],
    variants: [
      { id: 'var_hoodie_s', title: 'S', price: 35.83, isAvailable: true },
      { id: 'var_hoodie_m', title: 'M', price: 35.83, isAvailable: true },
      { id: 'var_hoodie_l', title: 'L', price: 35.83, isAvailable: true },
      { id: 'var_hoodie_xl', title: 'XL', price: 35.83, isAvailable: true },
      { id: 'var_hoodie_2xl', title: '2XL', price: 38.83, isAvailable: true },
    ],
    tags: ['hoodie', 'fractal', 'glitch', 'streetwear'],
  },
  {
    id: 'prod_tired_dad_cap',
    title: "I'm Tired Dad Cap",
    slug: 'im-tired-dad-cap',
    description:
      "Same energy, different day. This embroidered dad cap says what everyone's thinking. Adjustable strap, pre-curved brim. Wear it everywhere while avoiding chores.",
    price: 39.75,
    category: 'caps',
    images: ['/products/cap-placeholder.svg'],
    variants: [
      { id: 'var_cap_one', title: 'One Size', price: 39.75, isAvailable: true },
    ],
    tags: ['cap', 'dad cap', 'embroidered', 'tired'],
  },
  {
    id: 'prod_birthday_dude_tee',
    title: 'Mama of the Birthday Dude T-Shirt',
    slug: 'mama-of-the-birthday-dude-tshirt',
    description:
      'Every birthday dude needs a mama repping the squad. Soft, comfy tee perfect for birthday parties and family photos. Premium cotton, pre-shrunk.',
    price: 32.99,
    category: 'tees',
    images: ['/products/tee-placeholder.svg'],
    variants: [
      { id: 'var_tee_bd_s', title: 'S', price: 32.99, isAvailable: true },
      { id: 'var_tee_bd_m', title: 'M', price: 32.99, isAvailable: true },
      { id: 'var_tee_bd_l', title: 'L', price: 32.99, isAvailable: true },
      { id: 'var_tee_bd_xl', title: 'XL', price: 32.99, isAvailable: true },
      { id: 'var_tee_bd_2xl', title: '2XL', price: 34.99, isAvailable: true },
    ],
    tags: ['tee', 'birthday', 'mama', 'family'],
  },
  {
    id: 'prod_dinner_tee',
    title: "What's For Dinner? Tee",
    slug: 'whats-for-dinner-tee',
    description:
      'The universal kid question, now in wearable form. Soft ringspun cotton, classic fit. Guaranteed to make parents laugh (or cry).',
    price: 18.81,
    category: 'tees',
    images: ['/products/tee-placeholder.svg'],
    variants: [
      { id: 'var_tee_wd_s', title: 'S', price: 18.81, isAvailable: true },
      { id: 'var_tee_wd_m', title: 'M', price: 18.81, isAvailable: true },
      { id: 'var_tee_wd_l', title: 'L', price: 18.81, isAvailable: true },
      { id: 'var_tee_wd_xl', title: 'XL', price: 18.81, isAvailable: true },
      { id: 'var_tee_wd_2xl', title: '2XL', price: 20.81, isAvailable: true },
    ],
    tags: ['tee', 'funny', 'dinner', 'typography'],
  },
];

/**
 * Derive a category from Printify product tags and title.
 * Must return one of: tees | hoodies | mugs | stickers | caps
 */
function detectCategory(product) {
  const tags = (product.tags || []).map((t) => t.toLowerCase());
  const title = (product.title || '').toLowerCase();
  const combined = [...tags, title].join(' ');

  if (/hoodie|sweatshirt|pullover|crewneck/.test(combined)) return 'hoodies';
  if (/mug|cup|drinkware|tumbler/.test(combined)) return 'mugs';
  if (/sticker|decal|vinyl|patch/.test(combined)) return 'stickers';
  if (/cap|hat|beanie|bucket hat|dad cap|snapback/.test(combined)) return 'caps';
  return 'tees';
}

/**
 * Generate a URL-safe slug from a product title.
 */
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = async function (context, req) {
  try {
    const printifyApiKey = process.env.PRINTIFY_API_KEY;
    const printifyShopId = process.env.PRINTIFY_SHOP_ID;

    // Debug: expose whether credentials are present (not the values)
    const debug = {
      hasApiKey: !!printifyApiKey,
      hasShopId: !!printifyShopId,
      shopIdUsed: printifyShopId,
    };

    // Debug: fetch available shops to verify correct shop ID
    if (printifyApiKey) {
      try {
        const shopsRes = await fetch(`${PRINTIFY_API_BASE}/shops.json`, {
          headers: { Authorization: `Bearer ${printifyApiKey}` },
        });
        const shopsData = await shopsRes.json();
        debug.availableShops = shopsData;
      } catch (e) {
        debug.shopsError = e.message;
      }
    }

    if (printifyApiKey && printifyShopId) {
      try {
        const res = await fetch(
          `${PRINTIFY_API_BASE}/shops/${printifyShopId}/products.json?limit=100`,
          {
            headers: {
              Authorization: `Bearer ${printifyApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Printify API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const printifyProducts = data.data;

        const products = printifyProducts
          .filter((pp) => pp.visible !== false) // only published products
          .map((pp) => {
            const enabledVariants = pp.variants.filter(
              (v) => v.is_enabled && v.is_available
            );
            const lowestPrice = enabledVariants.length
              ? Math.min(...enabledVariants.map((v) => v.price)) / 100
              : 0;

            // Default image: prefer is_default, else first
            const defaultImg =
              pp.images.find((img) => img.is_default) || pp.images[0];

            return {
              id: pp.id,
              title: pp.title,
              slug: titleToSlug(pp.title),
              description: pp.description || '',
              price: lowestPrice,
              category: detectCategory(pp),
              images: pp.images
                .filter((img) => img.is_default || img.position === 'front')
                .map((img) => img.src)
                .concat(pp.images.map((img) => img.src))
                .filter((src, idx, arr) => arr.indexOf(src) === idx) // dedupe
                .slice(0, 5),
              variants: enabledVariants.map((v) => ({
                id: String(v.id),
                title: v.title,
                price: v.price / 100,
                isAvailable: v.is_available,
              })),
              tags: pp.tags || [],
            };
          });

        context.res = {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300', // 5-minute cache
          },
          body: JSON.stringify({ products, source: 'printify', debug }),
        };
        return;
      } catch (printifyError) {
        context.log.error(
          'Printify API error, falling back to mock data:',
          printifyError
        );
        debug.printifyError = printifyError.message;
      }
    }

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: MOCK_PRODUCTS, source: 'mock', debug }),
    };
  } catch (error) {
    context.log.error('Products API error:', error);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch products' }),
    };
  }
};
