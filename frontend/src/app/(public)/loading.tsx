import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <Skeleton className="h-6 w-48 mx-auto lg:mx-0" />
            <Skeleton className="h-12 w-full max-w-md mx-auto lg:mx-0" />
            <Skeleton className="h-12 w-3/4 mx-auto lg:mx-0" />
            <Skeleton className="h-5 w-full max-w-lg mx-auto lg:mx-0" />
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Skeleton className="h-12 w-full sm:w-36 rounded-lg" />
              <Skeleton className="h-12 w-full sm:w-36 rounded-lg" />
            </div>
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-80 w-full max-w-md rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 text-center space-y-2">
              <Skeleton className="h-10 w-10 rounded-full mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-3 w-28 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-4 w-32 mt-4 md:mt-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Skeleton className="h-60 w-full rounded-none" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
