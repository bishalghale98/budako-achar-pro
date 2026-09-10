import type { BrandStory } from "@/data/about";

interface BrandStorySectionProps {
  data: BrandStory;
}

export function BrandStorySection({ data }: BrandStorySectionProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="h-80 overflow-hidden rounded-2xl bg-gray-100 sm:h-96">
              <img
                src={data.image}
                alt={data.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
              {data.tagline}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-dark-text">
              {data.heading}
            </h2>
            {data.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-gray-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
