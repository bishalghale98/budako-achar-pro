"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetCartQuery } from "@/features/cart";
import { paymentMethods, checkoutPage } from "@/data/checkout";
import { CustomerForm } from "@/components/checkout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const { data, isLoading, isError } = useGetCartQuery();

  const cart = data?.cart;
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const deliveryFee = checkoutPage.deliveryFee;
  const total = subtotal + deliveryFee;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
        {checkoutPage.heading}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <CustomerForm
            defaultCity={checkoutPage.defaultCity}
            defaultProvince={checkoutPage.defaultProvince}
            paymentMethods={paymentMethods}
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
          <h3 className="font-serif font-bold text-lg text-darkText">
            Order Summary
          </h3>

          {isLoading ? (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : isError || items.length === 0 ? (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">Your cart is empty.</p>
              <Link
                href="/products"
                className="text-sm text-maroon hover:underline mt-2 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-600 pt-2 border-t border-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {item.product.thumbnail_url ? (
                      <Image
                        src={item.product.thumbnail_url}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[8px]">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-darkText truncate">
                      {item.product.title} ({item.variant.name})
                    </p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="font-medium text-darkText">
                    NPR {item.subtotal}
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>NPR {deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-darkText text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-maroon">NPR {total}</span>
              </div>
            </div>
          )}

          <Link
            href="/order-success"
            className="block w-full py-3.5 bg-maroon text-white font-medium text-center rounded-lg hover:bg-maroon-hover transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              if (items.length === 0) e.preventDefault();
            }}
          >
            Place Order
          </Link>
        </div>
      </div>
    </main>
  );
}
