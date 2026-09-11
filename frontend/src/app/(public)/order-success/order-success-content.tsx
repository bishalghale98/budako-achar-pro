"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  if (!orderNumber) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-darkText">
              Thank You!
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Your order has been placed successfully.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/"
              className="block w-full py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition text-sm text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-darkText">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Thank you for shopping with{" "}
            <span className="font-semibold text-maroon">Buda Ko Achar</span>.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-1">
          <p className="text-gray-500">Order Number</p>
          <p className="font-bold text-darkText">{orderNumber}</p>
        </div>
        <p className="text-xs text-gray-500">
          We&apos;ll send you an email with your order details and account credentials.
        </p>
        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="block w-full py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition text-sm text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
