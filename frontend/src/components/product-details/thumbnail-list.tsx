"use client";

import Image from "next/image";
import { cn } from "cn";

interface ThumbnailListProps {
  thumbnails: { src: string; alt: string }[];
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
            "h-20 bg-card border rounded-lg overflow-hidden cursor-pointer relative transition",
            activeIndex === i
              ? "border-primary"
              : "border-border opacity-70 hover:opacity-100"
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
