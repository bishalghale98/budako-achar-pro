"use client";

import { useState } from "react";
import type { Product } from "@/features/products/product-types";
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
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      )}

      {product.variants && product.variants.length > 1 && (
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <h4 className="font-bold text-darkText text-sm">Select Size</h4>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock === 0}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  variant.id === selectedVariantId
                    ? "border-maroon bg-maroon text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-maroon"
                } ${variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {variant.name}
                <span className="ml-1">NPR {variant.price}</span>
                {variant.compare_price && (
                  <span className="ml-1 text-xs line-through opacity-60">
                    {variant.compare_price}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <AddToCartButton />
          <BuyNowButton />
        </div>
      </div>

      <ProductDetailsSection
        ingredients={product.description ?? "Authentic Nepali ingredients."}
        storageInfo="Store in a cool, dry place. Use a clean, dry spoon for serving. Keep tightly sealed."
      />
    </>
  );
}
