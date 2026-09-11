"use client";

import type { Category } from "@/features/products/product-types";

interface SidebarFiltersProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function SidebarFilters({
  categories,
  activeCategory,
  onCategoryChange,
}: SidebarFiltersProps) {
  return (
    <aside className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-darkText mb-4">
          Categories
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <button
              onClick={() => onCategoryChange("all")}
              className={`block py-1 text-left w-full ${
                activeCategory === "all"
                  ? "text-maroon font-semibold"
                  : "text-gray-600 hover:text-maroon"
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onCategoryChange(cat.id)}
                className={`block py-1 text-left w-full ${
                  activeCategory === cat.id
                    ? "text-maroon font-semibold"
                    : "text-gray-600 hover:text-maroon"
                }`}
              >
                {cat.name}
                {cat.products_count !== undefined && (
                  <span className="ml-1 text-xs text-gray-400">
                    ({cat.products_count})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
