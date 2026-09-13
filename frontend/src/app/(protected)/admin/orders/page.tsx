"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetAdminOrdersQuery } from "@/features/admin/admin-api";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const statusFilters = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useGetAdminOrdersQuery({
    page,
    per_page: 15,
    status: status === "all" ? undefined : status,
    search: search || undefined,
  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-darkText">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #, name, or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { if (v) { setStatus(v); setPage(1); } }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue>
              {statusFilters.find((s) => s.value === status)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-maroon">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        NPR {order.total}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs capitalize">{order.payment?.payment_method}</span>
                          <PaymentStatusBadge status={order.payment?.status ?? "pending"} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-xs font-medium text-maroon hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page} ({pagination.total} orders)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
