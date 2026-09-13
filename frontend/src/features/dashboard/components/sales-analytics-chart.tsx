"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetAdminSalesAnalyticsQuery } from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesSummaryCards } from "./sales-summary-cards";
import type { SalesPeriod, SalesAnalyticsPoint } from "../types";

const periods: { value: SalesPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: SalesAnalyticsPoint }>;
  currencySymbol?: string;
}

function CustomTooltip({ active, payload, currencySymbol = "NPR" }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-md">
      <p className="text-sm font-medium text-foreground">{data.label}</p>
      <p className="text-sm text-muted-foreground">
        {currencySymbol} {data.sales.toLocaleString()}
      </p>
      <p className="text-xs text-muted-foreground">
        {data.orders} order{data.orders !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

interface SalesAnalyticsChartProps {
  showSummary?: boolean;
}

export function SalesAnalyticsChart({ showSummary = false }: SalesAnalyticsChartProps) {
  const [period, setPeriod] = useState<SalesPeriod>("daily");
  const { data, isLoading, isError } = useGetAdminSalesAnalyticsQuery({ period });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showSummary && (
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
        )}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Sales Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          Failed to load analytics data. Please try again.
        </p>
      </div>
    );
  }

  const chartData = data?.points ?? [];

  return (
    <div className="space-y-4">
      {showSummary && <SalesSummaryCards data={data} isLoading={isLoading} />}

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">Sales Analytics</h2>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {periods.map((p) => (
              <Button
                key={p.value}
                variant={period === p.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setPeriod(p.value)}
                className={
                  period === p.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No sales data for this period.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div
              style={{ minWidth: period === "daily" ? "800px" : "600px" }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) =>
                      value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                    }
                  />
                  <Tooltip
                    content={
                      <CustomTooltip currencySymbol={data?.currency_symbol} />
                    }
                  />
                  <Bar
                    dataKey="sales"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
