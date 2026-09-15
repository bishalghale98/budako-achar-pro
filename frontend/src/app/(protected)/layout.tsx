"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/auth-hooks";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status, user } = useAuth();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && user?.role !== "admin") {
      router.replace("/customer");
    }
  }, [status, user, router]);

  useEffect(() => {
    if (status !== "authenticated") {
      timer.current = setTimeout(() => {
        router.replace("/login");
      }, 8000);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [status, router]);

  if (mounted && status === "authenticated" && user?.role === "admin") {
    return <>{children}</>;
  }

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

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="px-4 py-6 sm:px-6 sm:py-8">
          <DashboardGuard>{children}</DashboardGuard>
        </main>
      </div>
    </div>
  );
}
