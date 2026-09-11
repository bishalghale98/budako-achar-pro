"use client";

import Link from "next/link";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from "@/features/cart";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemCard, OrderSummary } from "@/components/cart";
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
              <div key={i} className="bg-background sm:bg-card p-4 sm:p-5 rounded-none sm:rounded-xl border-0 sm:border border-border shadow-none sm:shadow-sm flex items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <div className="flex justify-between pt-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-background sm:bg-card p-0 sm:p-6 rounded-none sm:rounded-xl border-0 sm:border border-border shadow-none sm:shadow-sm h-fit space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3 pt-2 border-t border-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
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
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={(id, qty) => updateCartItem({ cartItem: id, quantity: qty })}
              onRemove={(id) => removeCartItem(id)}
            />
          ))}
        </div>
        <OrderSummary subtotal={cart.subtotal} />
      </div>
    </main>
  );
}
