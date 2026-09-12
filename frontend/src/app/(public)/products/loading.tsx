import { AppBreadcrumb } from "@/components/shared";
import { PageHeader } from "@/components/shared";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AppBreadcrumb items={[{ label: "Products" }]} />
      <PageHeader
        title="Our Achar Collection"
        description="Discover our collection of traditional Nepali achar made with authentic spices."
      />
      <ProductListSkeleton />
    </div>
  );
}
