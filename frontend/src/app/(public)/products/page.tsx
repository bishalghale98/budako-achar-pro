"use client";

import { useState, useMemo } from "react";
import {
  SidebarFilters,
  SearchSortBar,
  ProductGrid,
} from "@/components/products";
import { PageHeader } from "@/components/shared";
import { categories, sortOptions, products as allProducts } from "@/data/products";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Featured");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortOption) {
      case "Price: Low to High":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "Name":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, sortOption, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Our Achar Collection"
        description="Discover our collection of traditional Nepali achar made with authentic spices."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <SidebarFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="lg:col-span-3 space-y-6">
          <SearchSortBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            sortOptions={sortOptions}
          />
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
