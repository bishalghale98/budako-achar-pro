"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/features/auth/auth-hooks";
import { useLogoutMutation } from "@/features/auth/auth-api";

const sidebarNav = [
  {
    title: "Dashboard",
    href: "/customer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    title: "My Orders",
    href: "/customer/orders",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
        <path d="m15 9 6-6" />
      </svg>
    ),
  },
  {
    title: "My Addresses",
    href: "/customer/addresses",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "My Profile",
    href: "/settings/profile",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Wishlist",
    href: "/customer/wishlist",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
];

const stats = [
  {
    label: "Total Orders",
    value: "2",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
        <path d="m15 9 6-6" />
      </svg>
    ),
  },
  {
    label: "Active",
    value: "1",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Delivered",
    value: "1",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: "Total Spent",
    value: "NPR 1,550",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const quickActions = [
  {
    title: "My Orders",
    description: "View order history",
    href: "/customer/orders",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
        <path d="m15 9 6-6" />
      </svg>
    ),
  },
  {
    title: "My Addresses",
    description: "Manage delivery addresses",
    href: "/customer/addresses",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "My Profile",
    description: "Update your details",
    href: "/settings/profile",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const recentOrders = [
  {
    id: "BKA-00003",
    date: "Aug 25, 2026",
    amount: "NPR 950",
    status: "Pending",
    statusBg: "bg-amber-50",
    statusColor: "text-amber-700",
  },
  {
    id: "BKA-00002",
    date: "Aug 25, 2026",
    amount: "NPR 600",
    status: "Delivered",
    statusBg: "bg-emerald-50",
    statusColor: "text-emerald-700",
  },
];

export default function CustomerPage() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6">
          {/* User Profile */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: "rgba(120, 27, 27, 0.1)", color: "#781B1B" }}
            >
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
                      ? "flex items-center gap-3 rounded-xl bg-[#781B1B] px-4 py-3 text-sm font-medium text-white"
                      : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  }
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 lg:col-span-3">
        {/* Welcome Banner */}
        <div
          className="flex items-center gap-4 rounded-2xl border p-6"
          style={{ backgroundColor: "#FDF6EC", borderColor: "#F4E4CE" }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(244, 228, 206, 0.6)", color: "#781B1B" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#781B1B" }}>
              Namaste, {user.name}
            </h1>
            <p className="text-sm text-slate-600">
              Welcome back to your account dashboard.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-[#781B1B]/30"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor}`}>
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold text-slate-900">Recent Orders</h2>
            <Link
              href="/customer/orders"
              className="text-xs font-semibold hover:underline"
              style={{ color: "#781B1B" }}
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: "#781B1B" }}>
                    {order.id}
                  </p>
                  <p className="text-xs text-slate-500">{order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-slate-900">{order.amount}</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${order.statusBg} ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
