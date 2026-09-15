import Image from "next/image";
import type { AboutHero } from "@/data/about";

interface AboutHeroSectionProps {
  data: AboutHero;
}

export function AboutHeroSection({ data }: AboutHeroSectionProps) {
  return (
    <section className="bg-linear-to-br from-maroon/5 via-white to-gold/10 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
              {data.tagline}
            </span>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-dark-text sm:text-4xl lg:text-5xl">
              {data.heading}
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              {data.description}
            </p>
          </div>
          <div className="relative">
            <div className="relative h-80 overflow-hidden rounded-2xl bg-gray-100 sm:h-96">
              <Image
                src={data.image}
                alt={data.imageAlt}
                className="h-full w-full object-cover"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
