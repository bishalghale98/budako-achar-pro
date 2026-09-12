import Image from "next/image";

interface ProductImageProps {
  image: { src: string; alt: string };
  priority?: boolean;
}

export function ProductImage({ image, priority }: ProductImageProps) {
  return (
    <div className="aspect-square bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
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
