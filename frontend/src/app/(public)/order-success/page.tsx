import { Suspense } from "react";
import { OrderSuccessContent } from "./order-success-content";

export default function OrderSuccessPage() {
  return (
    <div className="font-sans bg-lightBg text-darkText antialiased flex flex-col min-h-screen">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-gray-200">
        &copy; {new Date().getFullYear()} Buda Ko Achar. All rights reserved.
      </footer>
    </div>
  );
}
