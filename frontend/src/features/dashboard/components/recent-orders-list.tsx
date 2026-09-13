"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DashboardOverviewResponse, RecentOrder } from "../types";

interface RecentOrdersListProps {
  data: DashboardOverviewResponse | undefined;
  isLoading: boolean;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-0",
  confirmed: "bg-blue-50 text-blue-700 border-0",
  processing: "bg-violet-50 text-violet-700 border-0",
  shipped: "bg-cyan-50 text-cyan-700 border-0",
  delivered: "bg-emerald-50 text-emerald-700 border-0",
  cancelled: "bg-red-50 text-red-700 border-0",
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RecentOrdersList({ data, isLoading }: RecentOrdersListProps) {
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

  const { recent_orders, currency_symbol } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-maroon hover:underline"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {recent_orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-2">
          {recent_orders.map((order: RecentOrder) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{order.order_number}</p>
                <p className="text-xs text-muted-foreground truncate">{order.customer_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {currency_symbol} {order.total.toLocaleString()}
                </span>
                <Badge
                  variant="secondary"
                  className={`capitalize text-xs ${statusStyles[order.status] ?? ""}`}
                >
                  {order.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
