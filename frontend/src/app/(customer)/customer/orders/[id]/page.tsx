"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCustomerOrderQuery,
  useCancelOrderMutation,
} from "@/features/customer/customer-api";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, ChevronRight } from "lucide-react";

const statusFlow = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useGetCustomerOrderQuery(id);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const order = data?.order;

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    try {
      await cancelOrder({ id, reason: cancelReason }).unwrap();
      setCancelDialogOpen(false);
      setCancelReason("");
    } catch {
      // error handled by UI
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-100 rounded w-48 animate-pulse" />
        <div className="h-64 bg-slate-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  const currentIdx = statusFlow.indexOf(order.status);
  const canCancel = ["pending", "confirmed", "processing"].includes(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-darkText">
              {order.order_number}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {statusFlow.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    i <= currentIdx && order.status !== "cancelled"
                      ? "bg-maroon text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span className="capitalize">{s}</span>
                </div>
                {i < statusFlow.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-slate-300 mx-1 shrink-0" />
                )}
              </div>
            ))}
            {order.status === "cancelled" && (
              <div className="flex items-center ml-2">
                <ChevronRight className="h-4 w-4 text-slate-300 mx-1 shrink-0" />
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 whitespace-nowrap">
                  Cancelled
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Items</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variant_name} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">NPR {item.subtotal}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Cancellation Info */}
          {order.status === "cancelled" && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-red-700">Cancellation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p><span className="font-medium">Cancelled at:</span> {order.cancelled_at ? new Date(order.cancelled_at).toLocaleString() : "—"}</p>
                <p><span className="font-medium">Reason:</span> {order.cancellation_reason || "—"}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium capitalize">{order.payment?.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <PaymentStatusBadge status={order.payment?.status ?? "pending"} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">NPR {order.payment?.amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-0.5">
              <p>{order.address_line}</p>
              {order.area && <p>{order.area}</p>}
              <p>{order.city}, {order.province}</p>
              {order.delivery_notes && (
                <p className="text-xs text-muted-foreground italic mt-2">{order.delivery_notes}</p>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>NPR {order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>NPR {order.delivery_fee}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2">
                <span>Total</span>
                <span className="text-maroon">NPR {order.total}</span>
              </div>
            </CardContent>
          </Card>

          {/* Cancel Button */}
          {canCancel && (
            <Button
              onClick={() => setCancelDialogOpen(true)}
              variant="outline"
              className="w-full rounded-lg border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel order <strong>{order.order_number}</strong>? This action cannot be undone.
            </p>
            <Textarea
              placeholder="Please provide a reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setCancelDialogOpen(false); setCancelReason(""); }}
              className="rounded-lg"
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancel}
              disabled={!cancelReason.trim() || isCancelling}
              className="rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
