import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: string;
  weight: string;
  rating: string;
  description: string;
  image: string;
  alt: string;
}

export function ProductCard({
  name,
  price,
  weight,
  rating,
  description,
  image,
  alt,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group">
      <div className="h-60 bg-gray-100 overflow-hidden relative">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm">
          {weight}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-gold text-sm mb-1">
          <span>★</span>{" "}
          <span className="text-darkText font-bold text-xs">{rating}</span>
        </div>
        <h3 className="font-serif font-bold text-lg text-darkText">{name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-maroon text-lg">{price}</span>
          <Link
            href="/product-details"
            className="px-4 py-2 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition"
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
