"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from "@/features/cart";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummary } from "@/components/cart";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { data, isLoading, isError } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-9 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </main>
    );
  }

  if (isError || !data?.cart) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
          Your Achar Basket
        </h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 mb-4">Something went wrong loading your cart.</p>
          <Link
            href="/products"
            className="px-6 py-2.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const { cart } = data;

  if (cart.items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
          Your Achar Basket
        </h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="font-serif text-xl font-bold text-darkText mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added any achar yet.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
        Your Achar Basket
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {item.product.thumbnail_url ? (
                    <Image
                      src={item.product.thumbnail_url}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-darkText">
                    {item.product.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {item.variant.name}
                    {item.variant.weight && (
                      <> &middot; {item.variant.weight}{item.variant.unit}</>
                    )}
                  </p>
                  <p className="text-maroon font-bold text-sm mt-1">
                    NPR {item.unit_price}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => {
                      if (item.quantity <= 1) {
                        removeCartItem(item.id);
                      } else {
                        updateCartItem({
                          cartItem: item.id,
                          quantity: item.quantity - 1,
                        });
                      }
                    }}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartItem({
                        cartItem: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeCartItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <OrderSummary subtotal={cart.subtotal} />
      </div>
    </main>
  );
}
