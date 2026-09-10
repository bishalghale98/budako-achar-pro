import Link from "next/link";
import Image from "next/image";
import { brandStoryImage } from "@/data/home";

export function BrandStory() {
  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
            Our Story
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-darkText">
            The Taste of Home
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Traditional flavors, familiar spices, and the kind of achar that
            brings every meal closer to home. Prepared with traditional methods
            in Itahari, Buda Ko Achar brings authentic Nepali zest straight to
            your dining table.
          </p>
          <div>
            <Link
              href="/about"
              className="inline-block px-6 py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 h-80 lg:h-96 relative">
            <Image
              src={brandStoryImage.src}
              alt={brandStoryImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
