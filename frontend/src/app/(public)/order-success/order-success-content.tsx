"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  if (!orderNumber) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full text-center">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-darkText">
                Thank You!
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Your order has been placed successfully.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-lg bg-maroon px-4 py-3.5 text-sm font-medium text-white hover:bg-maroon-hover transition shadow-sm"
            >
              Continue Shopping
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full text-center">
        <CardContent className="space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-darkText">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Thank you for shopping with{" "}
              <span className="font-semibold text-maroon">Buda Ko Achar</span>.
            </p>
          </div>
          <div className="bg-muted p-4 rounded-xl text-sm space-y-1">
            <p className="text-muted-foreground">Order Number</p>
            <p className="font-bold text-darkText">{orderNumber}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll send you an email with your order details and account credentials.
          </p>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-maroon px-4 py-3.5 text-sm font-medium text-white hover:bg-maroon-hover transition shadow-sm"
          >
            Continue Shopping
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
