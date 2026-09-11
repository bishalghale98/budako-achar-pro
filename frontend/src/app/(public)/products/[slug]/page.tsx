import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/server/product";
import { ProductGallery } from "@/components/product-details";
import { AppBreadcrumb } from "@/components/shared";
import { ProductDetailsClient } from "./product-details-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

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
      <AppBreadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: product.title },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={images} />

        <div className="space-y-6">
          <ProductDetailsClient product={product} description={description} />
        </div>
      </div>
    </main>
  );
}
