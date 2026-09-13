"use client";

import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import type { SalesAnalyticsResponse } from "../types";

interface SalesSummaryCardsProps {
  data: SalesAnalyticsResponse | undefined;
  isLoading: boolean;
}

function formatCurrency(amount: number, symbol: string): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${symbol} ${formatted}`;
}

export function SalesSummaryCards({ data, isLoading }: SalesSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-7 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { summary, currency_symbol } = data;

  const cards = [
    {
      label: "Total Sales",
      value: formatCurrency(summary.total_sales, currency_symbol),
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Orders",
      value: summary.total_orders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Average Order",
      value: formatCurrency(summary.average_order_value, currency_symbol),
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.color}`}
          >
            <card.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
