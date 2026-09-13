"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import type { DashboardOverviewResponse } from "../types";

interface LowStockAlertsProps {
  data: DashboardOverviewResponse | undefined;
  isLoading: boolean;
}

export function LowStockAlerts({ data, isLoading }: LowStockAlertsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { low_stock } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Inventory Alerts</h2>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-maroon hover:underline"
        >
          View products <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {low_stock.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle className="mb-2 h-8 w-8 text-emerald-500" />
          <p className="text-sm font-medium text-foreground">All stock levels healthy</p>
          <p className="text-xs text-muted-foreground">No variants below threshold.</p>
        </div>
      ) : (
        <>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <AlertTriangle className="h-3 w-3" />
            {low_stock.length} variant{low_stock.length !== 1 ? "s" : ""} low on stock
          </div>
          <div className="space-y-2">
            {low_stock.map((item) => (
              <div
                key={`${item.product_name}-${item.variant_name}`}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.variant_name}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${
                      item.stock === 0 ? "text-red-600" : "text-amber-600"
                    }`}
                  >
                    {item.stock} remaining
                  </span>
                  {item.sku && (
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
