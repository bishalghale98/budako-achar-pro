"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/features/auth/auth-hooks";
import { useLogoutMutation } from "@/features/auth/auth-api";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { LayoutDashboard, ClipboardList, MapPin, User, Heart, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerLoading from "./customer/loading";

const sidebarNav = [
  {
    title: "Dashboard",
    href: "/customer",
    icon: <LayoutDashboard className="h-4.5 w-4.5" />,
  },
  {
    title: "My Orders",
    href: "/customer/orders",
    icon: <ClipboardList className="h-4.5 w-4.5" />,
  },
  {
    title: "My Addresses",
    href: "/customer/addresses",
    icon: <MapPin className="h-4.5 w-4.5" />,
  },
  {
    title: "My Profile",
    href: "/settings/profile",
    icon: <User className="h-4.5 w-4.5" />,
  },
  {
    title: "Wishlist",
    href: "/customer/wishlist",
    icon: <Heart className="h-4.5 w-4.5" />,
  },
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const [logoutApi] = useLogoutMutation();

  if (!user) return <CustomerLoading />;

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6">
          {/* User Profile */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-sm font-bold text-maroon">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 py-6">
            {sidebarNav.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "flex items-center gap-3 rounded-xl bg-maroon px-4 py-3 text-sm font-medium text-white"
                      : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  }
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
            {user.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className={
                  pathname === "/dashboard" || pathname.startsWith("/dashboard/")
                    ? "flex items-center gap-3 rounded-xl bg-maroon px-4 py-3 text-sm font-medium text-white"
                    : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                }
              >
                <Shield className="h-4.5 w-4.5" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Logout */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 justify-start"
            >
              <LogOut className="h-4.5 w-4.5" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6 lg:col-span-3">
        {children}
      </div>
    </div>
  );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </div>
      <PublicFooter />
    </>
  );
}
