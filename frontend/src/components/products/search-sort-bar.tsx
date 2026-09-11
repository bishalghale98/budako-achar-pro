"use client";

import { Input } from "@/components/ui/input";

interface SearchSortBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  sortOptions: string[];
}

export function SearchSortBar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  sortOptions,
}: SearchSortBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
      <Input
        type="text"
        placeholder="Search achar..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-72"
      />
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full sm:w-auto px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-3 focus:ring-ring/50 bg-background"
      >
        {sortOptions.map((opt) => (
          <option key={opt} value={opt}>
            Sort by: {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
