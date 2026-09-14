"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useUser } from "@/features/auth/auth-hooks";
import { useLogoutMutation } from "@/features/auth/auth-api";
import { useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut, Menu, FolderTree, Package, ClipboardList, CreditCard, Settings, FileText, ChevronRight } from "lucide-react";

const sidebarNav = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-4.5 w-4.5" />,
      },
    ],
  },
  {
    label: "Commerce",
    items: [
      {
        title: "Orders",
        href: "/admin/orders",
        icon: <ClipboardList className="h-4.5 w-4.5" />,
      },
      {
        title: "Payments",
        href: "/admin/payments",
        icon: <CreditCard className="h-4.5 w-4.5" />,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: <Package className="h-4.5 w-4.5" />,
      },
      {
        title: "Categories",
        href: "/admin/category",
        icon: <FolderTree className="h-4.5 w-4.5" />,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Pages",
        href: "/admin/pages",
        icon: <FileText className="h-4.5 w-4.5" />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: <Settings className="h-4.5 w-4.5" />,
      },
      {
        title: "Profile",
        href: "/admin/profile",
        icon: <User className="h-4.5 w-4.5" />,
      },
    ],
  },
];

function SidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("admin-sidebar");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      try {
        localStorage.setItem("admin-sidebar", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isGroupOpen = (label: string, hrefs: string[]) => {
    if (openGroups[label] !== undefined) return openGroups[label];
    return hrefs.some(
      (href) => pathname === href || pathname.startsWith(href + "/")
    );
  };

  const isAnyChildActive = (hrefs: string[]) =>
    hrefs.some(
      (href) => pathname === href || pathname.startsWith(href + "/")
    );

  return (
    <nav className="flex flex-col gap-0.5" role="navigation" aria-label="Admin sidebar">
      {sidebarNav.map((group) => {
        const hrefs = group.items.map((i) => i.href);
        const open = isGroupOpen(group.label, hrefs);
        const hasActiveChild = isAnyChildActive(hrefs);

        return (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              aria-expanded={open}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                hasActiveChild
                  ? "bg-maroon/5 text-maroon"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {group.label}
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                  open && "rotate-90"
                )}
              />
            </button>

            <div
              role="group"
              aria-label={group.label}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-in-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-maroon text-white shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
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

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
    <div className="border-t border-border p-4">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback className="bg-maroon/10 text-xs font-bold text-maroon">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {user.role && (
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-0 capitalize">
            {user.role}
          </Badge>
        )}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
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
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/wordmark.png"
              alt="Buda Ko Achar"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="border-t border-slate-100" />
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
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" showCloseButton className="w-72 flex flex-col bg-card p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
        <SidebarUser />
      </SheetContent>
    </Sheet>
  );
}
