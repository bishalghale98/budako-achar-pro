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
