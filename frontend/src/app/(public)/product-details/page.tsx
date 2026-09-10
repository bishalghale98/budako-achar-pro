"use client";

import { useState } from "react";
import { productDetails } from "@/data/product-details";
import {
  ProductGallery,
  ProductInfo,
  QuantitySelector,
  AddToCartButton,
  BuyNowButton,
  ProductDetailsSection,
} from "@/components/product-details";

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={productDetails.images} />

        <div className="space-y-6">
          <ProductInfo product={productDetails} />
          <p className="text-gray-600 text-sm leading-relaxed">
            {productDetails.description}
          </p>
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AddToCartButton />
              <BuyNowButton />
            </div>
          </div>
          <ProductDetailsSection
            ingredients={productDetails.ingredients}
            storageInfo={productDetails.storageInfo}
          />
        </div>
      </div>
    </main>
  );
}
