"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        className="w-full sm:w-auto"
      />
      <Select value={sortOption} onValueChange={(val) => val && onSortChange(val)}>
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue>
            Sort by: {sortOption}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              Sort by: {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
