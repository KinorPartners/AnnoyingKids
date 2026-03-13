import { PrintifyProduct, PrintifyOrder } from '@/types';

const PRINTIFY_API_BASE = 'https://api.printify.com/v1';

function getHeaders(): HeadersInit {
  const apiKey = process.env.PRINTIFY_API_KEY;
  if (!apiKey) {
    throw new Error('PRINTIFY_API_KEY is not set.');
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

function getShopId(): string {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!shopId) {
    throw new Error('PRINTIFY_SHOP_ID is not set.');
  }
  return shopId;
}

export function isPrintifyConfigured(): boolean {
  return Boolean(process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID);
}

export async function fetchProducts(): Promise<PrintifyProduct[]> {
  const shopId = getShopId();
  const res = await fetch(`${PRINTIFY_API_BASE}/shops/${shopId}/products.json`, {
    headers: getHeaders(),
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data as PrintifyProduct[];
}

export async function fetchProduct(productId: string): Promise<PrintifyProduct> {
  const shopId = getShopId();
  const res = await fetch(
    `${PRINTIFY_API_BASE}/shops/${shopId}/products/${productId}.json`,
    {
      headers: getHeaders(),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as PrintifyProduct;
}

export async function createOrder(order: PrintifyOrder): Promise<{ id: string }> {
  const shopId = getShopId();
  const res = await fetch(
    `${PRINTIFY_API_BASE}/shops/${shopId}/orders.json`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(order),
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `Failed to create Printify order: ${res.status} ${res.statusText} - ${errorBody}`
    );
  }

  return (await res.json()) as { id: string };
}

export async function publishProduct(productId: string): Promise<void> {
  const shopId = getShopId();
  const res = await fetch(
    `${PRINTIFY_API_BASE}/shops/${shopId}/products/${productId}/publish.json`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title: true,
        description: true,
        images: true,
        variants: true,
        tags: true,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to publish product: ${res.status} ${res.statusText}`);
  }
}
