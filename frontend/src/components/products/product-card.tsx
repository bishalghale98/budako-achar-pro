import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="h-52 bg-gray-100 relative">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-gold text-xs mb-1">
          <span>★</span>{" "}
          <span className="text-darkText font-bold">{product.rating}</span>
        </div>
        <h3 className="font-serif font-bold text-base text-darkText">
          {product.title}
        </h3>
        <p className="text-gray-500 text-xs mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-maroon text-sm">
            NPR {product.price}{" "}
            <span className="text-xs text-gray-400 font-normal">
              / {product.unit}
            </span>
          </span>
          <Link
            href={`/product-details?slug=${product.slug}`}
            className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
