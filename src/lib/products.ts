import { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_anime_ramen_mug',
    title: 'Anime Girl Ramen Mug',
    slug: 'anime-girl-ramen-mug',
    description: 'Fuel your chaos with ramen and anime energy. This 11oz ceramic mug features a vibrant anime girl slurping ramen — because every main character needs proper fuel. Microwave and dishwasher safe. Perfect for hot chocolate, ramen broth, or whatever potion you\'re brewing.',
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
    description: 'Stick your chaos everywhere. These high-quality vinyl stickers feature a glitched-out neon portrait that looks like your face after an all-night gaming session. Waterproof, scratch-resistant, and built to survive the apocalypse (or at least a school backpack).',
    price: 2.41,
    category: 'stickers',
    images: ['/products/sticker-placeholder.svg'],
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
    description: 'Wrap yourself in digital chaos. This premium hoodie features an all-over glitched fractal portrait that\'ll make people do a double-take. Ultra-soft fleece interior, kangaroo pocket for snack storage, and a hood big enough to disappear into when adults start talking about responsibilities.',
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
    description: 'Same energy, different day. This embroidered dad cap says what everyone\'s thinking. Adjustable strap fits all head sizes (even the big-brained ones). Pre-curved brim for that effortlessly cool look. Wear it to school, to the mall, or just around the house while avoiding chores.',
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
    description: 'Because every birthday dude needs a mama repping the squad. This soft, comfy tee is perfect for birthday parties, family photos, or any occasion where you need to announce who raised the main character. Premium cotton, pre-shrunk, and ready to party.',
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
    description: 'The universal kid question, now in wearable form. This graphic tee features bold typography that captures the eternal struggle of every household. Soft ringspun cotton, classic fit, and guaranteed to make parents laugh (or cry). Either way, you win.',
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

export function getRelatedProducts(currentSlug: string, limit: number = 3): Product[] {
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
