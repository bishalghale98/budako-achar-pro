import Image from "next/image";
import type { ProductImage } from "@/data/product-details";

interface ProductImageProps {
  image: ProductImage;
  priority?: boolean;
}

export function ProductImage({ image, priority }: ProductImageProps) {
  return (
    <div className="h-96 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
