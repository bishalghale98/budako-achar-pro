import { Suspense } from "react";
import { OrderSuccessContent } from "./order-success-content";
import { Skeleton } from "@/components/ui/skeleton";
import { getSiteSettings } from "@/lib/server/site-settings";

function OrderSuccessSkeleton() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-6 text-center">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-4 w-56 mx-auto" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </main>
  );
}

export default async function OrderSuccessPage() {
  const settings = await getSiteSettings();
  const brandName = settings?.brand_name || "Buda Ko Achar";

  return (
    <div className="font-sans bg-lightBg text-darkText antialiased flex flex-col min-h-screen">
      <Suspense fallback={<OrderSuccessSkeleton />}>
        <OrderSuccessContent />
      </Suspense>
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-gray-200">
        &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
      </footer>
    </div>
  );
}
