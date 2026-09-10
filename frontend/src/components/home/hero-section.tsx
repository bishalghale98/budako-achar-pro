import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { heroProduct } from "@/data/home";

export function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-maroon/5 via-white to-gold/10 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-maroon px-3 py-1 rounded-full text-xs font-semibold">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span>4.2 / 5 Rated by Food Enthusiasts (23 Reviews)</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-darkText leading-tight">
            Authentic Taste of <span className="text-maroon">Nepali Achar</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
            Traditional flavors, bold spices, and homemade goodness in every
            bite, carefully prepared at Sangeet Chowk, Itahari.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 bg-maroon text-white font-medium rounded-lg shadow-sm hover:bg-maroon-hover transition text-center"
            >
              Shop Achar
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-darkText border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition text-center"
            >
              Our Story
            </Link>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute -inset-1 bg-linear-to-r from-gold to-maroon rounded-2xl blur-lg opacity-25" />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden">
            <div className="h-80 bg-gray-100 overflow-hidden relative">
              <Image
                src={heroProduct.image}
                alt={heroProduct.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-semibold text-maroon shadow">
                {heroProduct.weight}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-serif font-bold text-lg sm:text-xl">
                {heroProduct.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{heroProduct.tagline}</p>
                <span className="text-maroon font-bold text-lg sm:text-xl">
                  {heroProduct.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
