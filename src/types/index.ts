export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: 'tees' | 'hoodies' | 'mugs' | 'stickers' | 'caps';
  images: string[];
  variants: ProductVariant[];
  tags: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: PrintifyOption[];
  variants: PrintifyVariant[];
  images: PrintifyImage[];
}

export interface PrintifyOption {
  name: string;
  type: string;
  values: { id: number; title: string }[];
}

export interface PrintifyVariant {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
  is_available: boolean;
  options: number[];
}

export interface PrintifyImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
}

export interface PrintifyOrder {
  external_id: string;
  line_items: {
    product_id: string;
    variant_id: number;
    quantity: number;
  }[];
  shipping_method: number;
  send_shipping_notification: boolean;
  address_to: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    region: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
}
