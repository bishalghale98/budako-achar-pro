export interface OrderItem {
  id: string;
  product_id: string;
  product_variant_id: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderPayment {
  id: string;
  payment_method: string;
  status: string;
  amount: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_line: string;
  city: string;
  province: string;
  delivery_notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: OrderItem[];
  payment: OrderPayment;
  created_at: string;
  updated_at: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order: Order;
}

export interface PlaceOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_line: string;
  city: string;
  province: string;
  delivery_notes?: string;
  payment_method: string;
  payment_proof?: File;
}
