import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/server/product";
import {
  ProductGallery,
  ProductInfo,
  ProductDetailsSection,
} from "@/components/product-details";
import { ProductDetailsClient } from "./product-details-client";

interface Props {
  searchParams: Promise<{ slug?: string }>;
}

export default async function ProductDetailsPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  if (!slug) {
    notFound();
  }

  let productData;
  try {
    productData = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  const product = productData.product;
  const images = product.images ?? [];
  const description = product.description ?? product.short_description ?? "";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={images} />

        <div className="space-y-6">
          <ProductInfo product={product} />
          {description && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          )}
          <ProductDetailsClient product={product} />
        </div>
      </div>
    </main>
  );
}
