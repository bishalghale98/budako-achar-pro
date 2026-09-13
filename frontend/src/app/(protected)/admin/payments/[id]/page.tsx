"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useGetAdminPaymentQuery,
  useVerifyPaymentMutation,
  useRejectPaymentMutation,
} from "@/features/admin/admin-api";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
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
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";

export default function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading } = useGetAdminPaymentQuery(id);
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [rejectPayment, { isLoading: isRejecting }] = useRejectPaymentMutation();

  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const payment = data?.payment;
  const proofUrl = payment?.proof_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments/${id}/proof`
    : null;

  const handleVerify = async () => {
    try {
      await verifyPayment(id).unwrap();
    } catch {
      // error handled by UI
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      await rejectPayment({ id, reason: rejectReason }).unwrap();
      setRejectDialog(false);
      setRejectReason("");
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

  if (!payment) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Payment not found.</p>
      </div>
    );
  }

  const isPending = payment.status === "pending";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="font-serif text-2xl font-bold text-darkText">
              Payment Details
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              ID: {payment.id}
            </p>
          </div>
        </div>
        {isPending && (
          <div className="flex gap-2">
            <Button
              onClick={handleVerify}
              disabled={isVerifying}
              className="gap-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Verify Payment
            </Button>
            <Button
              onClick={() => setRejectDialog(true)}
              disabled={isRejecting}
              variant="outline"
              className="gap-1.5 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Payment info + proof */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Method</p>
                  <p className="font-medium capitalize">{payment.payment_method}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-medium">NPR {payment.amount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {new Date(payment.created_at).toLocaleString()}
                  </p>
                </div>
                {payment.verified_by && (
                  <div>
                    <p className="text-muted-foreground">Verified By</p>
                    <p className="font-medium">{payment.verified_by}</p>
                  </div>
                )}
                {payment.verified_at && (
                  <div>
                    <p className="text-muted-foreground">Verified At</p>
                    <p className="font-medium">
                      {new Date(payment.verified_at).toLocaleString()}
                    </p>
                  </div>
                )}
                {payment.rejection_reason && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Rejection Reason</p>
                    <p className="font-medium text-red-600">
                      {payment.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Proof */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Payment Proof</CardTitle>
            </CardHeader>
            <CardContent>
              {payment.proof_image ? (
                <div className="space-y-3">
                  {proofUrl ? (
                    <div className="relative group">
                      <img
                        src={proofUrl}
                        alt="Payment proof"
                        className="w-full rounded-lg border border-border"
                      />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/90 backdrop-blur rounded-lg p-1.5 shadow-sm hover:bg-white"
                        >
                          <ExternalLink className="h-4 w-4 text-slate-600" />
                        </a>
                        <a
                          href={proofUrl}
                          download
                          className="bg-white/90 backdrop-blur rounded-lg p-1.5 shadow-sm hover:bg-white"
                        >
                          <Download className="h-4 w-4 text-slate-600" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    File: {payment.proof_image}
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No proof uploaded
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Order info + actions */}
        <div className="space-y-6">
          {/* Linked Order */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Linked Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payment.order ? (
                <>
                  <div>
                    <p className="text-muted-foreground text-xs">Order Number</p>
                    <Link
                      href={`/admin/orders/${payment.order.id}`}
                      className="font-bold text-maroon hover:underline"
                    >
                      {payment.order.order_number}
                    </Link>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Order Status</p>
                    <OrderStatusBadge status={payment.order.status} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No linked order</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {isPending && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-medium text-amber-800">
                  This payment is pending verification.
                </p>
                <p className="text-xs text-amber-700">
                  Review the proof screenshot and order details, then verify or reject.
                  Verifying will auto-confirm the linked order.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    size="sm"
                    className="flex-1 gap-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {isVerifying ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5" />
                    )}
                    Verify
                  </Button>
                  <Button
                    onClick={() => setRejectDialog(true)}
                    disabled={isRejecting}
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isPending && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  This payment has been <strong>{payment.status}</strong>.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for rejecting this payment.
            </p>
            <Textarea
              placeholder="Rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setRejectDialog(false); setRejectReason(""); }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
              className="rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {isRejecting ? "Rejecting..." : "Reject Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
