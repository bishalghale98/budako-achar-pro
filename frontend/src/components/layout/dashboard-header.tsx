"use client";

import { useUser } from "@/features/auth/auth-hooks";
import { MobileSidebarTrigger } from "./dashboard-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 sm:px-6">
      <MobileSidebarTrigger />

      <div className="flex-1" />

      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Avatar>
            <AvatarFallback className="bg-maroon/10 text-xs font-bold text-maroon">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
