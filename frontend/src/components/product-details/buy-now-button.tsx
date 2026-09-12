"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddCartItemMutation } from "@/features/cart";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface BuyNowButtonProps {
  productId: string;
  variantId: string;
  quantity: number;
}

export function BuyNowButton({
  productId,
  variantId,
  quantity,
}: BuyNowButtonProps) {
  const router = useRouter();
  const [addToCart, { isLoading }] = useAddCartItemMutation();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    try {
      await addToCart({
        product_id: productId,
        product_variant_id: variantId,
        quantity,
      }).unwrap();
      router.push("/checkout");
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
      <Button
        onClick={handleClick}
        disabled={isLoading || !variantId}
        className="w-full h-12 bg-gold text-maroon font-bold rounded-lg hover:bg-gold/90 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" />
        {isLoading ? "Processing..." : "Buy Now"}
      </Button>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
