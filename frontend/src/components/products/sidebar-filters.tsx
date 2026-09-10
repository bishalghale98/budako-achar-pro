"use client";

import Link from "next/link";
import type { Category } from "@/data/products";

interface SidebarFiltersProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
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
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onCategoryChange(cat.slug)}
                className={`block py-1 text-left w-full ${
                  activeCategory === cat.slug
                    ? "text-maroon font-semibold"
                    : "text-gray-600 hover:text-maroon"
                }`}
              >
                {cat.name}
                {cat.count !== undefined && (
                  <span className="ml-1 text-xs text-gray-400">
                    ({cat.count})
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
