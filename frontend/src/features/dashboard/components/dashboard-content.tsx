"use client";

import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { useGetAdminDashboardOverviewQuery } from "@/features/admin/admin-api";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesAnalyticsChart } from "./sales-analytics-chart";
import { KpiCards } from "./kpi-cards";
import { OrderPipeline } from "./order-pipeline";
import { RecentOrdersList } from "./recent-orders-list";
import { TopProductsList } from "./top-products-list";
import { LowStockAlerts } from "./low-stock-alerts";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
}

export function DashboardContent() {
  const user = useUser();
  const isLoading = useIsLoading();
  const { data: overviewData, isLoading: isOverviewLoading } =
    useGetAdminDashboardOverviewQuery();

  if (isLoading) return <DashboardSkeleton />;
  if (!user) return null;

  const todayDate = overviewData?.today_date;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-cream bg-cream/50 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon/10 text-maroon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-maroon">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Welcome back{user ? `, ${user.name}` : ""}{todayDate ? ` — ${todayDate}` : ""}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards data={overviewData} isLoading={isOverviewLoading} />

      {/* Sales Analytics Chart */}
      <SalesAnalyticsChart />

      {/* Order Pipeline */}
      <OrderPipeline data={overviewData} isLoading={isOverviewLoading} />

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrdersList data={overviewData} isLoading={isOverviewLoading} />
        <TopProductsList data={overviewData} isLoading={isOverviewLoading} />
      </div>

      {/* Low Stock Alerts */}
      <LowStockAlerts data={overviewData} isLoading={isOverviewLoading} />
    </div>
  );
}
