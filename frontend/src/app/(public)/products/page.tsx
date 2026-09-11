import { PageHeader } from "@/components/shared";
import { ProductList } from "@/components/products/product-list";
import { getProducts, getCategories } from "@/lib/server/product";

export default async function ProductsPage() {
  const [productsData, categoriesData] = await Promise.all([
    getProducts({ per_page: 12 }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Our Achar Collection"
        description="Discover our collection of traditional Nepali achar made with authentic spices."
      />
      <ProductList
        initialProducts={productsData.data ?? []}
        initialCategories={categoriesData.categories ?? []}
      />
    </div>
  );
}
