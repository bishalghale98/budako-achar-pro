import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={`text-[10px] font-bold capitalize ${statusStyles[status] ?? "bg-slate-50 text-slate-700"}`}
    >
      {status}
    </Badge>
  );
}
