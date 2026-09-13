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
  proof_image: string | null;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
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
  area: string | null;
  city: string;
  province: string;
  delivery_notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  items: OrderItem[];
  payment: OrderPayment;
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}

export interface PaymentsResponse {
  success: boolean;
  payments: OrderPayment[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  payment: OrderPayment;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface PlaceOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_id?: string;
  address_line?: string;
  area?: string;
  city?: string;
  province?: string;
  delivery_notes?: string;
  payment_method: string;
  payment_proof?: File;
}
