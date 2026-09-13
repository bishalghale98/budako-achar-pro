"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { DashboardOverviewResponse } from "../types";

interface OrderPipelineProps {
  data: DashboardOverviewResponse | undefined;
  isLoading: boolean;
}

const statuses = [
  { key: "pending" as const, label: "Pending", color: "bg-amber-500", bgColor: "bg-amber-50", textColor: "text-amber-700" },
  { key: "confirmed" as const, label: "Confirmed", color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700" },
  { key: "processing" as const, label: "Processing", color: "bg-violet-500", bgColor: "bg-violet-50", textColor: "text-violet-700" },
  { key: "shipped" as const, label: "Shipped", color: "bg-cyan-500", bgColor: "bg-cyan-50", textColor: "text-cyan-700" },
  { key: "delivered" as const, label: "Delivered", color: "bg-emerald-500", bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
  { key: "cancelled" as const, label: "Cancelled", color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700" },
];

export function OrderPipeline({ data, isLoading }: OrderPipelineProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { order_status } = data;
  const pendingCount = order_status.pending;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Order Operations</h2>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <AlertTriangle className="h-3 w-3" />
            {pendingCount} pending
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {statuses.map((s) => (
          <Link
            key={s.key}
            href={`/admin/orders?status=${s.key}`}
            className="group rounded-xl border border-border p-3 text-center transition-colors hover:bg-accent/50"
          >
            <div className={`mx-auto mb-2 h-2 w-2 rounded-full ${s.color}`} />
            <p className="text-xl font-bold text-foreground">{order_status[s.key]}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
