"use client";

import { useUser } from "@/features/auth/auth-hooks";
import { MobileSidebarTrigger } from "./dashboard-sidebar";

export function DashboardHeader() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 sm:px-6 dark:bg-dark-surface/95 dark:supports-[backdrop-filter]:bg-dark-surface/60">
      <MobileSidebarTrigger />

      <div className="flex-1" />

      {user && (
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline-block">
            {user.name}
          </span>
        </div>
      )}
    </header>
  );
}
