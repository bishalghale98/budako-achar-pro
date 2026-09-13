export type SalesPeriod = "daily" | "weekly" | "monthly";

export interface SalesAnalyticsPoint {
  label: string;
  date: string;
  sales: number;
  orders: number;
}

export interface SalesAnalyticsResponse {
  success: boolean;
  period: SalesPeriod;
  currency_code: string;
  currency_symbol: string;
  summary: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
  };
  points: SalesAnalyticsPoint[];
}

// ── Dashboard Overview ──────────────────────────────────

export interface DashboardKpis {
  today_sales: number;
  today_sales_change: number;
  today_orders: number;
  today_orders_change: number;
  month_sales: number;
  month_sales_change: number;
  total_customers: number;
  new_customers_this_month: number;
  customer_growth_pct: number;
  average_order_value: number;
  aov_change: number;
}

export interface OrderStatusCounts {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export interface TopProduct {
  product_name: string;
  variant_name: string;
  units_sold: number;
  revenue: number;
}

export interface LowStockItem {
  product_name: string;
  variant_name: string;
  stock: number;
  sku: string | null;
}

export interface DashboardOverviewResponse {
  success: boolean;
  today_date: string;
  currency_code: string;
  currency_symbol: string;
  kpis: DashboardKpis;
  order_status: OrderStatusCounts;
  recent_orders: RecentOrder[];
  top_products: TopProduct[];
  low_stock: LowStockItem[];
}
