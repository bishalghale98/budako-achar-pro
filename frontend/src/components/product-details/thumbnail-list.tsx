"use client";

import Image from "next/image";
import type { ProductImage } from "@/data/product-details";
import { cn } from "cn";

interface ThumbnailListProps {
  thumbnails: ProductImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ThumbnailList({
  thumbnails,
  activeIndex,
  onSelect,
}: ThumbnailListProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {thumbnails.map((thumb, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "h-20 bg-white border rounded-lg overflow-hidden cursor-pointer relative transition",
            activeIndex === i
              ? "border-maroon"
              : "border-gray-200 opacity-70 hover:opacity-100"
          )}
        >
          <Image
            src={thumb.src}
            alt={thumb.alt}
            fill
            className="object-cover"
            sizes="80px"
          />
        </button>
      ))}
    </div>
  );
}
