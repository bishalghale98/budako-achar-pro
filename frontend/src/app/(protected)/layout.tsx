"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/auth-hooks";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

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

  if (mounted && status === "authenticated") {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      <div className="h-7 w-32 animate-pulse rounded bg-muted" />
      <div className="h-20 animate-pulse rounded bg-muted" />
      <div className="h-20 animate-pulse rounded bg-muted" />
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
