import Link from "next/link";
import Image from "next/image";
import { ourStory } from "@/data/home";

export function BrandStory() {
  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
            {ourStory.label}
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-darkText">
            {ourStory.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {ourStory.description}
          </p>
          <div>
            <Link
              href="/about"
              className="inline-block px-6 py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition"
            >
              {ourStory.btnText}
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 h-80 lg:h-96 relative">
            <Image
              src={ourStory.brandStoryImage.src}
              alt={ourStory.brandStoryImage.alt}
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
