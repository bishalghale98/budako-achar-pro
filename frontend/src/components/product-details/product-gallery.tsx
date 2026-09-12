"use client";

import { useState } from "react";
import type { ProductImage as ProductImageType } from "@/features/products/product-types";
import { ProductImage } from "./product-image";
import { ThumbnailList } from "./thumbnail-list";

interface ProductGalleryProps {
  images: ProductImageType[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProductImage
        image={{ src: images[activeIndex].image_url, alt: "" }}
        priority
      />
      {images.length > 1 && (
        <ThumbnailList
          thumbnails={images.map((img) => ({
            src: img.image_url,
            alt: "",
          }))}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      )}
    </div>
  );
}
