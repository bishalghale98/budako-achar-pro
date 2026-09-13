"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetCustomerOrdersQuery } from "@/features/customer/customer-api";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

export default function CustomerOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetCustomerOrdersQuery({ page, per_page: 10 });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-darkText">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your order history
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No orders yet</p>
            <Link
              href="/products"
              className="text-sm text-maroon hover:underline mt-2 inline-block"
            >
              Start shopping
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/customer/orders/${order.id}`}
              className="block"
            >
              <Card className="hover:border-maroon/30 transition">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-maroon">{order.order_number}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">NPR {order.total}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items?.length ?? 0} items
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page}
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
