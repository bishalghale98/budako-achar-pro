"use client";

import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesAnalyticsChart } from "./sales-analytics-chart";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-[400px] rounded-2xl" />
    </div>
  );
}

export function DashboardContent() {
  const user = useUser();
  const isLoading = useIsLoading();

  if (isLoading) return <DashboardSkeleton />;
  if (!user) return null;

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
            Welcome back, {user.name}
          </p>
        </div>
      </div>

      {/* Sales Analytics (manages its own period state + data fetching) */}
      <SalesAnalyticsChart showSummary />
    </div>
  );
}
