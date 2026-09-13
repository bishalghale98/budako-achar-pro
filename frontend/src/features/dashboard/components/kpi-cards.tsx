"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  CalendarDays,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import type { DashboardOverviewResponse } from "../types";

interface KpiCardsProps {
  data: DashboardOverviewResponse | undefined;
  isLoading: boolean;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol} ${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function ChangeIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
        <ArrowUpRight className="h-3 w-3" />
        {Math.abs(value)}%
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600">
        <ArrowDownRight className="h-3 w-3" />
        {Math.abs(value)}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />
      0%
    </span>
  );
}

export function KpiCards({ data, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="h-4 w-20 animate-pulse rounded bg-muted mb-3" />
            <div className="h-7 w-24 animate-pulse rounded bg-muted mb-2" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { kpis, currency_symbol } = data;

  const cards = [
    {
      label: "Today's Sales",
      value: formatCurrency(kpis.today_sales, currency_symbol),
      change: kpis.today_sales_change,
      subtitle: "vs yesterday",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-700",
      link: "/admin/orders?status=delivered",
    },
    {
      label: "Today's Orders",
      value: kpis.today_orders.toLocaleString(),
      change: kpis.today_orders_change,
      subtitle: "vs yesterday",
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-700",
      link: "/admin/orders",
    },
    {
      label: "Month Revenue",
      value: formatCurrency(kpis.month_sales, currency_symbol),
      change: kpis.month_sales_change,
      subtitle: "vs last month",
      icon: CalendarDays,
      color: "bg-violet-50 text-violet-700",
      link: "/admin/orders?status=delivered",
    },
    {
      label: "Customers",
      value: kpis.total_customers.toLocaleString(),
      subvalue: `+${kpis.new_customers_this_month} this month`,
      change: kpis.customer_growth_pct,
      subtitle: "growth",
      icon: Users,
      color: "bg-amber-50 text-amber-700",
      link: "/admin/orders",
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(kpis.average_order_value, currency_symbol),
      change: kpis.aov_change,
      subtitle: "vs yesterday",
      icon: TrendingUp,
      color: "bg-cyan-50 text-cyan-700",
      link: "/admin/orders",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.link}
          className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent/50"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
            <ChangeIndicator value={card.change} />
          </div>
          <p className="text-2xl font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground">{card.label}</p>
          {card.subvalue && (
            <p className="mt-1 text-xs text-muted-foreground">{card.subvalue}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
