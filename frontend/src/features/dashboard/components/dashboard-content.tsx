"use client";

import { useRouter } from "next/navigation";
import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { useLogoutMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Mail, CheckCircle, XCircle } from "lucide-react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Email Status Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {isVerified ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{isVerified ? "Yes" : "No"}</p>
            <p className="text-xs text-muted-foreground">Email Verified</p>
          </div>
        </div>

        {/* Role Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground capitalize">{user.role || "User"}</p>
            <p className="text-xs text-muted-foreground">Account Role</p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-semibold text-foreground">Profile Information</h2>
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
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
          {user.role && (
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground capitalize">
                {user.role}
              </span>
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
