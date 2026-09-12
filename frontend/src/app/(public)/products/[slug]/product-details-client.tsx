"use client";

import { useState } from "react";
import type { Product } from "@/features/products/product-types";
import { Button } from "@/components/ui/button";
import {
  ProductInfo,
  QuantitySelector,
  AddToCartButton,
  BuyNowButton,
  ProductDetailsSection,
} from "@/components/product-details";

interface ProductDetailsClientProps {
  product: Product;
  description: string;
}

export function ProductDetailsClient({
  product,
  description,
}: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id ?? ""
  );

  const selectedVariant = product.variants?.find(
    (v) => v.id === selectedVariantId
  );

  return (
    <>
      <ProductInfo product={product} selectedVariant={selectedVariant} />

      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      )}

      {product.variants && product.variants.length > 1 && (
        <div className="space-y-2 pt-4 border-t border-border">
          <h4 className="font-bold text-foreground text-sm">Select Size</h4>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <Button
                key={variant.id}
                variant="outline"
                size="lg"
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock === 0}
                className={`min-h-11 px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  variant.id === selectedVariantId
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground hover:border-primary"
                } ${variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {variant.name}
                <span className="ml-1">NPR {variant.price}</span>
                {variant.compare_price && (
                  <span className="ml-1 text-xs line-through opacity-60">
                    {variant.compare_price}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-border">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <AddToCartButton
            productId={product.id}
            variantId={selectedVariantId}
            quantity={quantity}
          />
          <BuyNowButton
            productId={product.id}
            variantId={selectedVariantId}
            quantity={quantity}
          />
        </div>
      </div>

      <ProductDetailsSection
        ingredients={product.ingredients ?? "Authentic Nepali ingredients."}
        storageInfo={product.storage_info ?? "Store in a cool, dry place. Use a clean, dry spoon for serving. Keep tightly sealed."}
      />
    </>
  );
}
