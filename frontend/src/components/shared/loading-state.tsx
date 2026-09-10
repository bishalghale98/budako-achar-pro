import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={`flex flex-1 items-center justify-center px-4 py-12 ${className ?? ""}`}>
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
