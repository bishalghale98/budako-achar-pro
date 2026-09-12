"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useGetProductsQuery,
} from "@/features/products/product-api";
import { useGetCategoriesQuery } from "@/features/products/category-api";
import { SidebarFilters } from "./sidebar-filters";
import { SearchSortBar } from "./search-sort-bar";
import { ProductGrid } from "./product-grid";
import {  ErrorState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@/features/products/product-types";
import { ProductListSkeleton } from "./product-list-skeleton";

const SORT_MAP: Record<string, string> = {
  Featured: "featured",
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  Name: "name",
};

const SORT_OPTIONS = Object.keys(SORT_MAP);



export function ProductList() {

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);
  const [sortOption, setSortOption] = useState("Featured");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: productsData, isLoading, isError } = useGetProductsQuery({
    page,
    per_page: 12,
    category_id: activeCategory === "all" ? undefined : activeCategory,
    search: debouncedSearch || undefined,
    sort: SORT_MAP[sortOption] ?? "featured",
  });

  const categories = categoriesData?.categories;
  const products = productsData?.data;

  if (isLoading) return <ProductListSkeleton />;
  if (isError) return <ErrorState />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <SidebarFilters
        categories={categories as Category[]}
        activeCategory={activeCategory}
        onCategoryChange={(id) => {
          setActiveCategory(id);
          setPage(1);
        }}
      />

      <div className="lg:col-span-3 space-y-6">
        <SearchSortBar
          searchQuery={searchInput}
          onSearchChange={(q) => {
            setSearchInput(q);
            setPage(1);
          }}
          sortOption={sortOption}
          onSortChange={setSortOption}
          sortOptions={SORT_OPTIONS}
        />
        <ProductGrid products={products as Product[]} />

        {productsData && productsData.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from(
              { length: productsData.last_page },
              (_, i) => i + 1
            ).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className={p === page ? "bg-maroon text-white hover:bg-maroon-hover" : ""}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
