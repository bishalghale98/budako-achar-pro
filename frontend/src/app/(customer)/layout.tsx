"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/auth-hooks";
import { Header } from "@/components/layout";

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <div className="h-[500px] animate-pulse rounded-2xl bg-white" />
      </div>
      <div className="space-y-6 lg:col-span-3">
        <div className="h-[100px] animate-pulse rounded-2xl bg-white" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[80px] animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <div className="min-h-screen" style={{ backgroundColor: "#F8F6F2" }}>
      <Header />

      <div className="mx-auto max-w-7xl p-6">
        <DashboardGuard>{children}</DashboardGuard>
      </div>
    </div>
  );
}
