import { Skeleton } from "@/components/ui/skeleton";

export function ProductFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-cream bg-cream/50 p-6">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-20" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Form Sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          </div>
          <div className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
