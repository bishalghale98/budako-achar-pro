"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { CartItemCard, OrderSummary } from "@/components/cart";
import { cartItems as initialItems, cartPage } from "@/data/cart";

export default function CartPage() {
  const [items, setItems] = useState(initialItems);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
        {cartPage.heading}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
        <OrderSummary subtotal={subtotal} />
      </div>
    </main>
  );
}
