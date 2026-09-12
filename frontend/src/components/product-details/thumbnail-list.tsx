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
    <div className="flex gap-3 overflow-x-auto pb-1">
      {thumbnails.map((thumb, i) => (
        <Button
          key={i}
          variant="outline"
          size="icon"
          onClick={() => onSelect(i)}
          className={cn(
            "h-20 w-20 shrink-0 bg-card rounded-lg overflow-hidden relative p-0 transition-all",
            activeIndex === i
              ? "border-2 border-maroon ring-2 ring-maroon/20 opacity-100"
              : "border-border opacity-60 hover:opacity-100 hover:border-muted-foreground/50"
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
