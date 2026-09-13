"use client";

import Link from "next/link";
import { useUser } from "@/features/auth/auth-hooks";
import { useGetCustomerDashboardQuery } from "@/features/customer/customer-api";
import CustomerLoading from "./loading";

function StatCard({
  label,
  value,
  iconBg,
  iconColor,
  icon,
}: {
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

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
    href: "/customer/profile",
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

function getStatusStyle(status: string) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700";
    case "Confirmed":
    case "Processing":
      return "bg-blue-50 text-blue-700";
    case "Shipped":
      return "bg-purple-50 text-purple-700";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

export default function CustomerPage() {
  const user = useUser();
  const { data, isLoading } = useGetCustomerDashboardQuery();

  if (!user || isLoading) return <CustomerLoading />;

  const stats = data?.stats;
  const recentOrders = data?.recent_orders ?? [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-cream bg-cream/50 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon/10 text-maroon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-maroon">
            Namaste, {user.name}
          </h1>
          <p className="text-sm text-slate-600">
            Welcome back to your account dashboard.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={String(stats?.total_orders ?? 0)}
          iconBg="bg-rose-50"
          iconColor="text-rose-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5" />
              <path d="M8 3H3v5" />
              <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
              <path d="m15 9 6-6" />
            </svg>
          }
        />
        <StatCard
          label="Active"
          value={String(stats?.active_orders ?? 0)}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <StatCard
          label="Delivered"
          value={String(stats?.delivered_orders ?? 0)}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <StatCard
          label="Total Spent"
          value={stats?.total_spent ?? "NPR 0"}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-maroon/30"
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
            className="text-xs font-semibold text-maroon hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No orders yet.{" "}
              <Link href="/products" className="text-maroon hover:underline">
                Start shopping
              </Link>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-bold text-maroon">
                    {order.id}
                  </p>
                  <p className="text-xs text-slate-500">{order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-slate-900">{order.amount}</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
