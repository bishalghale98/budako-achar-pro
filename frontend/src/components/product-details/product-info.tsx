import type { ProductDetails } from "@/data/product-details";
import { ProductRating } from "./product-rating";

interface ProductInfoProps {
  product: ProductDetails;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div>
      <ProductRating
        rating={product.rating}
        reviewCount={product.reviewCount}
      />
      <h1 className="font-serif text-3xl lg:text-4xl font-bold text-darkText">
        {product.title}
      </h1>
      <p className="text-maroon font-bold text-2xl mt-2">
        NPR {product.price}{" "}
        <span className="text-xs text-gray-500 font-normal">
          / {product.unit}
        </span>
      </p>
    </div>
  );
}
