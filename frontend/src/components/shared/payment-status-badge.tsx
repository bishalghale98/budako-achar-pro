import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={`text-[10px] font-bold capitalize ${statusStyles[status] ?? "bg-slate-50 text-slate-700"}`}
    >
      {status}
    </Badge>
  );
}
