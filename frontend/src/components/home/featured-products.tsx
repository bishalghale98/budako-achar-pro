import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Product } from "@/features/products/product-types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
            Handcrafted Collection
          </span>
          <h2 className="font-serif text-3xl font-bold text-darkText mt-1">
            Our Popular Achar
          </h2>
          <p className="text-gray-600 mt-1">
            Traditional flavors made for every Nepali table.
          </p>
        </div>
        <Link
          href="/products"
          className="mt-4 md:mt-0 text-maroon font-semibold hover:underline inline-flex items-center gap-1"
        >
          View All Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
