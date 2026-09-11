import { ProductRating } from "./product-rating";
import type { Product, ProductVariant } from "@/features/products/product-types";

interface ProductInfoProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

export function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const price = selectedVariant?.price ?? product.variants?.[0]?.price ?? 0;
  const unit = selectedVariant
    ? `${selectedVariant.weight}${selectedVariant.unit}`
    : product.variants?.[0]
      ? `${product.variants[0].weight}${product.variants[0].unit}`
      : "";

  return (
    <div>
      <ProductRating
        rating={product.rating}
        reviewCount={product.review_count}
      />
      <h1 className="font-serif text-3xl lg:text-4xl font-bold text-darkText">
        {product.title}
      </h1>
      <p className="text-maroon font-bold text-2xl mt-2">
        NPR {price}{" "}
        {unit && (
          <span className="text-xs text-gray-500 font-normal">/ {unit}</span>
        )}
        {selectedVariant?.compare_price && (
          <span className="ml-2 text-sm line-through text-gray-500">
            NPR {selectedVariant.compare_price}
          </span>
        )}
      </p>
    </div>
  );
}
