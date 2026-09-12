"use client";

import Image from "next/image";
import type { CartItem } from "@/features/cart";
import { Button } from "@/components/ui/button";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (cartItem: string, quantity: number) => void;
  onRemove: (cartItem: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      {/* Product image */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
        {item.product.thumbnail_url ? (
          <Image
            src={item.product.thumbnail_url}
            alt={item.product.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No img
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Top row: title + remove */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-bold text-sm sm:text-base text-darkText leading-snug line-clamp-2">
            {item.product.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 transition h-6 w-6 flex-shrink-0 mt-0.5"
            aria-label="Remove item"
          >
            ×
          </Button>
        </div>

        {/* Variant */}
        <p className="text-xs text-gray-500">
          {item.variant.name}
          {item.variant.weight && (
            <> &middot; {item.variant.weight}{item.variant.unit}</>
          )}
        </p>

        {/* Bottom row: price + quantity */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-maroon font-bold text-sm">
            NPR {item.unit_price}
          </p>

          <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (item.quantity <= 1) {
                  onRemove(item.id);
                } else {
                  onUpdateQuantity(item.id, item.quantity - 1);
                }
              }}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition text-sm h-8 w-8"
            >
              -
            </Button>
            <span className="px-3 py-1 text-sm font-semibold tabular-nums min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition text-sm h-8 w-8"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
