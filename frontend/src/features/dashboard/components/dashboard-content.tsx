"use client";

import { useRouter } from "next/navigation";
import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { useLogoutMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";
import { SalesSummaryCards } from "./sales-summary-cards";
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
  const router = useRouter();
  const user = useUser();
  const isLoading = useIsLoading();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  if (isLoading) return <DashboardSkeleton />;
  if (!user) return null;

  const isVerified = !!user.email_verified_at;

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore
    } finally {
      router.replace("/login");
    }
  };

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

      {/* Account Information */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-semibold text-foreground">Account Information</h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-bold text-foreground">{user.name}</span>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-bold text-foreground">{user.email}</span>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-muted-foreground">Email Verified</span>
            <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-emerald-50 text-emerald-700 border-0" : "bg-amber-50 text-amber-700 border-0"}>
              {isVerified ? "Verified" : "Not Verified"}
            </Badge>
          </div>
          {user.role && (
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-0 capitalize">
                {user.role}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Session */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-semibold text-foreground">Session</h2>
        </div>
        <div className="px-6 py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Sign out of your current session.
          </p>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
