import { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_anime_ramen_mug',
    title: 'Anime Girl Ramen Mug',
    slug: 'anime-girl-ramen-mug',
    description:
      'Fuel your chaos with ramen and anime energy. This 11oz ceramic mug features a vibrant anime girl slurping ramen â because every main character needs proper fuel. Microwave and dishwasher safe. Perfect for hot chocolate, ramen broth, or whatever potion you\'re brewing.',
    price: 15.99,
    category: 'mugs',
    images: [
      'https://images.printify.com/mockup/69a9f7de4563b0e8130242d5/72180/102752/anime-girl-ramen-mug-whats-for-dinner-cute-kawaii-coffee-cup-1115oz.jpg?camera_label=front',
      'https://images.printify.com/mockup/69a9f7de4563b0e8130242d5/72180/102754/anime-girl-ramen-mug-whats-for-dinner-cute-kawaii-coffee-cup-1115oz.jpg?camera_label=right',
      'https://images.printify.com/mockup/69a9f7de4563b0e8130242d5/72180/102756/anime-girl-ramen-mug-whats-for-dinner-cute-kawaii-coffee-cup-1115oz.jpg?camera_label=left',
      'https://images.printify.com/mockup/69a9f7de4563b0e8130242d5/72180/102758/anime-girl-ramen-mug-whats-for-dinner-cute-kawaii-coffee-cup-1115oz.jpg?camera_label=back',
      'https://images.printify.com/mockup/69a9f7de4563b0e8130242d5/72180/102750/anime-girl-ramen-mug-whats-for-dinner-cute-kawaii-coffee-cup-1115oz.jpg?camera_label=front',
      'https://images.printify.com/mockup/69a9f7de4563b0e8130242d5/72180/102751/anime-girl-ramen-mug-whats-for-dinner-cute-kawaii-coffee-cup-1115oz.jpg?camera_label=front',
    ],
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
      'Stick your chaos everywhere. These high-quality vinyl stickers feature a glitched-out neon portrait that looks like your face after an all-night gaming session. Waterproof, scratch-resistant, and built to survive the apocalypse (or at least a school backpack).',
    price: 2.41,
    category: 'stickers',
    images: [
      'https://images.printify.com/mockup/69af2aa284870d7af80051ab/45750/16655/glitched-neon-visage-kiss-cut-stickers-fractal-glitch-art-chromatic-aberration.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af2aa284870d7af80051ab/45750/16655/glitched-neon-visage-kiss-cut-stickers-fractal-glitch-art-chromatic-aberration.jpg?camera_label=back',
      'https://images.printify.com/mockup/69af2aa284870d7af80051ab/45750/16655/glitched-neon-visage-kiss-cut-stickers-fractal-glitch-art-chromatic-aberration.jpg?camera_label=context',
    ],
    variants: [
      { id: 'var_sticker_3x3', title: '3" x 3"', price: 2.41, isAvailable: true },
      { id: 'var_sticker_4x4', title: '4" x 4"', price: 3.99, isAvailable: true },
      { id: 'var_sticker_6x6', title: '6" x 6"', price: 5.99, isAvailable: true },
    ],
    tags: ['stickers', 'neon', 'glitch', 'vinyl'],
  },

  {
    id: 'prod_fractal_hoodie',
    title: 'Glitched Portrait Fractal Hoodie',
    slug: 'glitched-portrait-fractal-hoodie',
    description:
      'Wrap yourself in digital chaos. This premium hoodie features an all-over glitched fractal portrait that\'ll make people do a double-take. Ultra-soft fleece interior, kangaroo pocket for snack storage, and a hood big enough to disappear into when adults start talking about responsibilities.',
    price: 35.83,
    category: 'hoodies',
    images: [
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32912/98424/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32912/98425/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32912/98426/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back-2',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32912/98432/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=folded',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32920/98424/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32920/98425/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32920/98426/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back-2',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32920/98432/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=folded',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/42166/98424/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/42166/98425/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/42166/98426/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back-2',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/42166/98432/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=folded',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32904/98424/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32904/98425/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32904/98426/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back-2',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32904/98432/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=folded',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32896/98424/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32896/98425/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32896/98426/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=back-2',
      'https://images.printify.com/mockup/69af2aa3b11e1d8f80047acb/32896/98432/glitched-portrait-fractal-hoodie-chromatic-aberration-glitch-art.jpg?camera_label=folded',
    ],
    variants: [
      { id: '32912', title: 'White / S', price: 35.35, isAvailable: true },
      { id: '32913', title: 'White / M', price: 35.35, isAvailable: true },
      { id: '32914', title: 'White / L', price: 35.35, isAvailable: true },
      { id: '32915', title: 'White / XL', price: 35.35, isAvailable: true },
      { id: '32916', title: 'White / 2XL', price: 38.94, isAvailable: true },
      { id: '32917', title: 'White / 3XL', price: 42.10, isAvailable: true },
      { id: '32918', title: 'White / 4XL', price: 33.64, isAvailable: true },
      { id: '32919', title: 'Black / S', price: 35.11, isAvailable: true },
      { id: '32920', title: 'Black / M', price: 35.11, isAvailable: true },
      { id: '32921', title: 'Black / L', price: 35.11, isAvailable: true },
      { id: '32922', title: 'Black / XL', price: 35.11, isAvailable: true },
      { id: '32923', title: 'Black / 2XL', price: 38.94, isAvailable: true },
      { id: '32924', title: 'Black / 3XL', price: 42.10, isAvailable: true },
      { id: '32925', title: 'Black / 4XL', price: 33.64, isAvailable: true },
      { id: '42166', title: 'Sand / S', price: 35.90, isAvailable: true },
      { id: '42167', title: 'Sand / M', price: 35.90, isAvailable: true },
      { id: '42168', title: 'Sand / L', price: 35.90, isAvailable: true },
      { id: '42169', title: 'Sand / XL', price: 35.90, isAvailable: true },
      { id: '42170', title: 'Sand / 2XL', price: 39.73, isAvailable: true },
      { id: '32904', title: 'Sport Grey / S', price: 35.05, isAvailable: true },
      { id: '32905', title: 'Sport Grey / M', price: 35.05, isAvailable: true },
      { id: '32906', title: 'Sport Grey / L', price: 35.05, isAvailable: true },
      { id: '32907', title: 'Sport Grey / XL', price: 35.05, isAvailable: true },
      { id: '32908', title: 'Sport Grey / 2XL', price: 38.94, isAvailable: true },
      { id: '32909', title: 'Sport Grey / 3XL', price: 32.84, isAvailable: true },
      { id: '32910', title: 'Sport Grey / 4XL', price: 32.53, isAvailable: true },
      { id: '32911', title: 'Sport Grey / 5XL', price: 33.10, isAvailable: true },
      { id: '32896', title: 'Navy / S', price: 35.83, isAvailable: true },
      { id: '32897', title: 'Navy / M', price: 35.83, isAvailable: true },
      { id: '32898', title: 'Navy / L', price: 35.83, isAvailable: true },
      { id: '32899', title: 'Navy / XL', price: 35.83, isAvailable: true },
      { id: '32900', title: 'Navy / 2XL', price: 38.94, isAvailable: true },
      { id: '32901', title: 'Navy / 3XL', price: 42.10, isAvailable: true },
      { id: '32902', title: 'Navy / 4XL', price: 33.64, isAvailable: true },
      { id: '32903', title: 'Navy / 5XL', price: 42.67, isAvailable: true },
    ],
    tags: ['hoodie', 'fractal', 'glitch', 'streetwear'],
  },

  {
    id: 'prod_tired_dad_cap',
    title: "I'm Tired Dad Cap",
    slug: 'im-tired-dad-cap',
    description:
      'Same energy, different day. This embroidered dad cap says what everyone\'s thinking. Adjustable strap fits all head sizes (even the big-brained ones). Pre-curved brim for that effortlessly cool look. Wear it to school, to the mall, or just around the house while avoiding chores.',
    price: 39.75,
    category: 'caps',
    images: [
      'https://images.printify.com/mockup/69af5a3e84870d7af8005abb/105381/102307/im-tired-dad-cap-minimal-embroidered-white-baseball-hat.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af5a3e84870d7af8005abb/105382/102307/im-tired-dad-cap-minimal-embroidered-white-baseball-hat.jpg?camera_label=front',
      'https://images.printify.com/mockup/69af5a3e84870d7af8005abb/105381/102307/im-tired-dad-cap-minimal-embroidered-white-baseball-hat.jpg?camera_label=back',
      'https://images.printify.com/mockup/69af5a3e84870d7af8005abb/105381/102307/im-tired-dad-cap-minimal-embroidered-white-baseball-hat.jpg?camera_label=context',
    ],
    variants: [
      { id: '105381', title: 'White / One Size', price: 39.75, isAvailable: true },
      { id: '105382', title: 'Black / One Size', price: 39.75, isAvailable: true },
    ],
    tags: ['cap', 'dad cap', 'embroidered', 'tired'],
  },

  {
    id: 'prod_birthday_dude_tee',
    title: 'Mama of the Birthday Dude T-Shirt',
    slug: 'mama-of-the-birthday-dude-tshirt',
    description:
      'Because every birthday dude needs a mama repping the squad. This soft, comfy tee is perfect for birthday parties, family photos, or any occasion where you need to announce who raised the main character. Premium cotton, pre-shrunk, and ready to party.',
    price: 32.99,
    category: 'tees',
    images: [
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18542/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=front',
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18548/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=front',
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18542/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=back',
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18542/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=context',
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18542/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=lifestyle',
    ],
    variants: [
      { id: '18542', title: 'White / S', price: 32.99, isAvailable: true },
      { id: '18543', title: 'White / M', price: 32.99, isAvailable: true },
      { id: '18544', title: 'White / L', price: 32.99, isAvailable: true },
      { id: '18545', title: 'White / XL', price: 32.99, isAvailable: true },
      { id: '18546', title: 'White / 2XL', price: 34.99, isAvailable: true },
      { id: '18548', title: 'Black / S', price: 32.99, isAvailable: true },
      { id: '18549', title: 'Black / M', price: 32.99, isAvailable: true },
      { id: '18550', title: 'Black / L', price: 32.99, isAvailable: true },
      { id: '18551', title: 'Black / XL', price: 32.99, isAvailable: true },
      { id: '18552', title: 'Black / 2XL', price: 34.99, isAvailable: true },
    ],
    tags: ['tee', 'birthday', 'mama', 'family'],
  },

  {
    id: 'prod_dinner_tee',
    title: "What's For Dinner? Tee",
    slug: 'whats-for-dinner-tee',
    description:
      'The universal kid question, now in wearable form. This graphic tee features bold typography that captures the eternal struggle of every household. Soft ringspun cotton, classic fit, and guaranteed to make parents laugh (or cry). Either way, you win.',
    price: 18.81,
    category: 'tees',
    images: [
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18542/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=front',
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18548/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=front',
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18542/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=back',
      'https://images.printify.com/mockup/697a7f2da4ed992a5c0507c3/18542/102044/unisex-jersey-short-sleeve-tee.jpg?camera_label=lifestyle',
    ],
    variants: [
      { id: '18542', title: 'White / S', price: 18.81, isAvailable: true },
      { id: '18543', title: 'White / M', price: 18.81, isAvailable: true },
      { id: '18544', title: 'White / L', price: 18.81, isAvailable: true },
      { id: '18545', title: 'White / XL', price: 18.81, isAvailable: true },
      { id: '18546', title: 'White / 2XL', price: 20.81, isAvailable: true },
      { id: '18548', title: 'Black / S', price: 18.81, isAvailable: true },
      { id: '18549', title: 'Black / M', price: 18.81, isAvailable: true },
      { id: '18550', title: 'Black / L', price: 18.81, isAvailable: true },
      { id: '18551', title: 'Black / XL', price: 18.81, isAvailable: true },
      { id: '18552', title: 'Black / 2XL', price: 20.81, isAvailable: true },
    ],
    tags: ['tee', 'funny', 'dinner', 'typography'],
  },
];

export function getAllProducts(): Product[] {
  return MOCK_PRODUCTS;
}

/**
 * Server-only: fetch live products from Printify at build time.
 * Prefers the pre-built cache (local images) written by scripts/fetch-products.mjs.
 * Falls back to live Printify API, then to MOCK_PRODUCTS.
 * Only call this from server components (page.tsx / generateStaticParams).
 */
export async function getProductsForBuild(): Promise<Product[]> {
  // 1. Try pre-built cache â products with locally downloaded images
  try {
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');
    const cachePath = resolve(process.cwd(), 'public/products-cache.json');
    const cached = JSON.parse(readFileSync(cachePath, 'utf8')) as Product[];
    if (cached.length > 0) {
      console.log(
        `[products] Using ${cached.length} cached products (local images)`
      );
      return cached;
    }
  } catch {
    // Cache not present â fall through
  }

  // 2. Fall back to live Printify API
  const { fetchPrintifyProducts } = await import('./printify');
  const live = await fetchPrintifyProducts();
  return live.length > 0 ? live : MOCK_PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.slice(0, 4);
}

export function getRelatedProducts(
  currentSlug: string,
  limit: number = 3
): Product[] {
  const current = getProductBySlug(currentSlug);
  if (!current) return MOCK_PRODUCTS.slice(0, limit);

  return MOCK_PRODUCTS.filter(
    (p) => p.slug !== currentSlug && p.category === current.category
  ).slice(0, limit).length > 0
    ? MOCK_PRODUCTS.filter(
        (p) => p.slug !== currentSlug && p.category === current.category
      ).slice(0, limit)
    : MOCK_PRODUCTS.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

export const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'tees', label: 'T-Shirts' },
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'mugs', label: 'Mugs' },
  { value: 'stickers', label: 'Stickers' },
  { value: 'caps', label: 'Caps' },
];
