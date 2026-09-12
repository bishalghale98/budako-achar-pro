import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductByCategorySlug, getCategoryBySlug } from "@/lib/server/product";
import { AppBreadcrumb } from "@/components/shared";
import { PageHeader } from "@/components/shared";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { Pagination } from "@/components/products/pagination";
import { Suspense } from "react";

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const SITE_NAME = "Budako Achar";
  const title = `${category.name} | Nepali Achar Collection`;
  const description = `Browse our collection of authentic ${category.name.toLowerCase()} made with traditional Nepali recipes.`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://budaachar.com"}/products/category/${categorySlug}`;

  return {
    title,
    description,
    keywords: [category.name, "Nepali Achar", "Traditional Pickles"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const result = await getProductByCategorySlug(categorySlug, { page });

  if (!result) {
    notFound();
  }

  const { category, products: productsData } = result;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AppBreadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: category.name },
        ]}
      />
      <PageHeader
        title={category.name}
        description={`Browse our collection of authentic ${category.name.toLowerCase()} made with traditional Nepali recipes.`}
      />
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductGrid products={productsData.data} />
        {productsData.last_page > 1 && (
          <Pagination
            currentPage={productsData.current_page}
            lastPage={productsData.last_page}
            baseUrl={`/products/category/${categorySlug}`}
          />
        )}
      </Suspense>
    </div>
  );
}
