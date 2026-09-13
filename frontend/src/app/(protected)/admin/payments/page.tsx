"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetAdminPaymentsQuery,
  useVerifyPaymentMutation,
  useRejectPaymentMutation,
} from "@/features/admin/admin-api";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle } from "lucide-react";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; paymentId: string | null }>({
    open: false,
    paymentId: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading } = useGetAdminPaymentsQuery({
    page,
    per_page: 15,
    status: status === "all" ? undefined : status,
  });

  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [rejectPayment, { isLoading: isRejecting }] = useRejectPaymentMutation();

  const payments = data?.payments ?? [];
  const pagination = data?.pagination;

  const handleVerify = async (id: string) => {
    try {
      await verifyPayment(id).unwrap();
    } catch {
      // error handled by UI
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.paymentId || !rejectReason.trim()) return;
    try {
      await rejectPayment({ id: rejectDialog.paymentId, reason: rejectReason }).unwrap();
      setRejectDialog({ open: false, paymentId: null });
      setRejectReason("");
    } catch {
      // error handled by UI
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-darkText">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify and manage payment proofs
        </p>
      </div>

      <div className="flex justify-end">
        <Select value={status} onValueChange={(v) => { if (v) { setStatus(v); setPage(1); } }}>
          <SelectTrigger className="w-40">
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

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Method</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/payments/${payment.id}`}
                          className="font-bold text-maroon hover:underline"
                        >
                          {payment.order?.order_number ?? "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 capitalize">{payment.payment_method}</td>
                      <td className="px-4 py-3 font-medium">NPR {payment.amount}</td>
                      <td className="px-4 py-3">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/payments/${payment.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                          </Link>
                          {payment.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVerify(payment.id)}
                                disabled={isVerifying}
                                className="h-8 gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Verify
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRejectDialog({ open: true, paymentId: payment.id })}
                                className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
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

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) => {
          setRejectDialog({ open, paymentId: null });
          if (!open) setRejectReason("");
        }}
      >
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
              onClick={() => { setRejectDialog({ open: false, paymentId: null }); setRejectReason(""); }}
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
