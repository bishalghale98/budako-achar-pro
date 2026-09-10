"use client";

import { useState } from "react";
import type { ProductImage as ProductImageType } from "@/data/product-details";
import { ProductImage } from "./product-image";
import { ThumbnailList } from "./thumbnail-list";

interface ProductGalleryProps {
  images: ProductImageType[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <ProductImage image={images[activeIndex]} priority />
      {images.length > 1 && (
        <ThumbnailList
          thumbnails={images}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      )}
    </div>
  );
}
