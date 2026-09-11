"use client";

import Image from "next/image";
import type { CartItem } from "@/features/cart";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (cartItem: string, quantity: number) => void;
  onRemove: (cartItem: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
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
                onRemove(item.id);
              } else {
                onUpdateQuantity(item.id, item.quantity - 1);
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
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition text-sm"
          >
            +
          </button>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
