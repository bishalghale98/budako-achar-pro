"use client";

import { useUser } from "@/features/auth/auth-hooks";
import { MobileSidebarTrigger } from "./dashboard-sidebar";

export function DashboardHeader() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
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
