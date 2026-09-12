"use client";

import Image from "next/image";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

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
        <Button
          key={i}
          variant="outline"
          size="icon"
          onClick={() => onSelect(i)}
          className={cn(
            "h-20 bg-card rounded-lg overflow-hidden relative p-0",
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
        </Button>
      ))}
    </div>
  );
}
