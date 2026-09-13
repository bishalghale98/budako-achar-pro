"use client";

import { Package } from "lucide-react";
import type { DashboardOverviewResponse } from "../types";

interface TopProductsListProps {
  data: DashboardOverviewResponse | undefined;
  isLoading: boolean;
}

export function TopProductsList({ data, isLoading }: TopProductsListProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 h-5 w-36 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { top_products, currency_symbol } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Top Products</h2>
        <span className="text-xs text-muted-foreground">By revenue</span>
      </div>

      {top_products.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <Package className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No product sales yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {top_products.map((product, i) => (
            <div
              key={`${product.product_name}-${product.variant_name}`}
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-maroon/10 text-xs font-bold text-maroon">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {product.product_name}
                </p>
                <p className="text-xs text-muted-foreground">{product.variant_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {currency_symbol} {product.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{product.units_sold} sold</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
