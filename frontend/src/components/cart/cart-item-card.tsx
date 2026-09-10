import Image from "next/image";
import type { CartItem } from "@/data/cart";

interface CartItemCardProps {
  item: CartItem;
  onRemove?: (id: string) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <h3 className="font-serif font-bold text-base text-darkText">
            {item.title}
          </h3>
          <p className="text-xs text-gray-500">Variant: {item.variant}</p>
          <p className="text-maroon font-bold text-sm mt-1">NPR {item.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm font-semibold">Qty: {item.quantity}</span>
        <button
          onClick={() => onRemove?.(item.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
