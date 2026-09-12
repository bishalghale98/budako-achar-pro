import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPageSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Title */}
          <Skeleton className="h-10 w-3/4" />

          {/* Price */}
          <Skeleton className="h-8 w-32" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Variant selector */}
          <div className="pt-4 border-t border-border space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-24 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Quantity + Buttons */}
          <div className="pt-4 border-t border-border space-y-4">
            <Skeleton className="h-12 w-36" />
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Skeleton className="h-12 w-full sm:w-48 rounded-lg" />
              <Skeleton className="h-12 w-full sm:w-48 rounded-lg" />
            </div>
          </div>

          {/* Ingredients & Storage */}
          <div className="pt-6 border-t border-border space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
