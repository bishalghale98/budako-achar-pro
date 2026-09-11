"use client";

import { useState } from "react";
import {
  useGetProductsQuery,
} from "@/features/products/product-api";
import { useGetCategoriesQuery } from "@/features/products/category-api";
import { SidebarFilters } from "./sidebar-filters";
import { SearchSortBar } from "./search-sort-bar";
import { ProductGrid } from "./product-grid";
import { LoadingState, ErrorState } from "@/components/shared";
import type { Product, Category } from "@/features/products/product-types";

interface ProductListProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export function ProductList({
  initialProducts,
  initialCategories,
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Featured");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: productsData, isLoading, isError } = useGetProductsQuery(
    {
      page,
      per_page: 12,
      category_id: activeCategory === "all" ? undefined : activeCategory,
      search: searchQuery || undefined,
    },
    {
      skip:
        !searchQuery &&
        activeCategory === "all" &&
        page === 1 &&
        sortOption === "Featured",
    }
  );

  const categories = categoriesData?.categories ?? initialCategories;
  let products = productsData?.data ?? initialProducts;

  switch (sortOption) {
    case "Price: Low to High":
      products = [...products].sort((a, b) => {
        const aPrice = a.variants?.[0]?.price ?? 0;
        const bPrice = b.variants?.[0]?.price ?? 0;
        return aPrice - bPrice;
      });
      break;
    case "Price: High to Low":
      products = [...products].sort((a, b) => {
        const aPrice = a.variants?.[0]?.price ?? 0;
        const bPrice = b.variants?.[0]?.price ?? 0;
        return bPrice - aPrice;
      });
      break;
    case "Name":
      products = [...products].sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      products = [...products].sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      );
  }

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <SidebarFilters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={(id) => {
          setActiveCategory(id);
          setPage(1);
        }}
      />

      <div className="lg:col-span-3 space-y-6">
        <SearchSortBar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          sortOption={sortOption}
          onSortChange={setSortOption}
          sortOptions={[
            "Featured",
            "Price: Low to High",
            "Price: High to Low",
            "Name",
          ]}
        />
        <ProductGrid products={products} />

        {productsData && productsData.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from(
              { length: productsData.last_page },
              (_, i) => i + 1
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded text-sm ${
                  p === page
                    ? "bg-maroon text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
