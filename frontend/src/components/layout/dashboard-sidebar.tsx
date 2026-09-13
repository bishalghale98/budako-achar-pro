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
import { LayoutDashboard, User, LogOut, Menu, FolderTree, Package, ClipboardList, CreditCard, Settings } from "lucide-react";

const sidebarNav = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4.5 w-4.5" />,
  },
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
  {
    title: "Products",
    href: "/admin/products",
    icon: <Package className="h-4.5 w-4.5" />,
  },
  {
    title: "Category",
    href: "/admin/category",
    icon: <FolderTree className="h-4.5 w-4.5" />,
  },
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
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-maroon text-white"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            {item.icon}
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
      <SheetContent side="left" showCloseButton className="w-72 bg-card p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col px-3 py-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
        <SidebarUser />
      </SheetContent>
    </Sheet>
  );
}
