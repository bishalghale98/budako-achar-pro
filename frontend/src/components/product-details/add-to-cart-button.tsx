"use client";

import { useState } from "react";
import { useAddCartItemMutation } from "@/features/cart";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  variantId: string;
  quantity: number;
}

export function AddToCartButton({
  productId,
  variantId,
  quantity,
}: AddToCartButtonProps) {
  const [addToCart, { isLoading }] = useAddCartItemMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    setSuccess(false);
    try {
      await addToCart({
        product_id: productId,
        product_variant_id: variantId,
        quantity,
      }).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to add to cart.";
      setError(message);
    }
  };

  return (
    <div className="flex-1 space-y-2">
      <button
        onClick={handleClick}
        disabled={isLoading || !variantId}
        className="w-full py-3.5 bg-maroon text-white font-medium rounded-lg text-center hover:bg-maroon-hover transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        <ShoppingBag className="w-4 h-4" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
      {success && (
        <p className="text-sm text-green-600 text-center">Added to cart!</p>
      )}
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
