import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/features/products/product-types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.images?.find((img) => img.is_thumbnail) ?? product.images?.[0];
  const lowestPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group">
      <div className="h-60 bg-gray-100 overflow-hidden relative">
        {thumbnail ? (
          <Image
            src={thumbnail.image_url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-gold text-sm mb-1">
          <span>★</span>{" "}
          <span className="text-darkText font-bold text-xs">
            {product.rating > 0 ? product.rating.toFixed(1) : "New"}
          </span>
          {product.review_count > 0 && (
            <span className="text-gray-400 text-xs ml-1">
              ({product.review_count})
            </span>
          )}
        </div>
        <h3 className="font-serif font-bold text-lg text-darkText">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.short_description ?? product.description ?? ""}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-maroon text-lg">
            {lowestPrice !== null ? `NPR ${lowestPrice}` : "Contact"}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="px-4 py-2 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
