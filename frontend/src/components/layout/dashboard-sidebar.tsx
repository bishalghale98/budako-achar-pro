"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/features/auth/auth-hooks";
import { useLogoutMutation } from "@/features/auth/auth-api";
import { useRouter } from "next/navigation";

const sidebarNav = [
  { title: "Dashboard", href: "/customer" },
  { title: "Profile", href: "/settings/profile" },
  { title: "Security", href: "/settings/security" },
];

function SidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {sidebarNav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-maroon/10 text-maroon font-semibold"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarUser() {
  const user = useUser();
  const router = useRouter();
  const [logoutApi] = useLogoutMutation();

  if (!user) return null;

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
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-xs font-bold text-maroon">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/50">
            {user.email}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {user.role && (
          <span className="inline-flex items-center rounded-md bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-maroon capitalize">
            {user.role}
          </span>
        )}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-7 gap-1.5 px-2 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/logos/wordmark.png"
              alt="Buda Ko Achar"
              width={120}
              height={32}
              className="h-7 w-auto"
            />
          </Link>
        </div>
        <Separator className="bg-sidebar-border" />
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav />
        </div>
        <SidebarUser />
      </aside>

      {/* Mobile sidebar trigger — rendered inside header via MobileSidebarTrigger */}
    </>
  );
}

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open menu"
          />
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </SheetTrigger>
      <SheetContent side="left" showCloseButton>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col px-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
        <SidebarUser />
      </SheetContent>
    </Sheet>
  );
}
