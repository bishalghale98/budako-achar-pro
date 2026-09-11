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
  const defaultVariant = product.variants?.[0];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="h-52 bg-gray-100 relative">
        {thumbnail ? (
          <Image
            src={thumbnail.image_url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-gold text-xs mb-1">
          <span>★</span>{" "}
          <span className="text-darkText font-bold">
            {product.rating > 0 ? product.rating.toFixed(1) : "New"}
          </span>
        </div>
        <h3 className="font-serif font-bold text-base text-darkText">
          {product.title}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {product.short_description ?? ""}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-maroon text-sm">
            {lowestPrice !== null ? (
              <>
                NPR {lowestPrice}{" "}
                {defaultVariant && (
                  <span className="text-xs text-gray-400 font-normal">
                    / {defaultVariant.weight}{defaultVariant.unit}
                  </span>
                )}
              </>
            ) : (
              "Contact"
            )}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
