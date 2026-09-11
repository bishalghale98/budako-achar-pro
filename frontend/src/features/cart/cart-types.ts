export interface CartProduct {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
}

export interface CartVariant {
  id: string;
  name: string;
  weight: number | null;
  unit: string | null;
  price: number;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  variant: CartVariant;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  item_count: number;
  total_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
}

export interface AddCartItemRequest {
  product_id: string;
  product_variant_id: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
