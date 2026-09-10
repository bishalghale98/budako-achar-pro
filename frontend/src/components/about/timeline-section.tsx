import { Card } from "@/components/ui/card";
import type { TimelineItem } from "@/data/about";

interface TimelineSectionProps {
  items: TimelineItem[];
}

export function TimelineSection({ items }: TimelineSectionProps) {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
            Our Journey
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-dark-text">
            Through the Years
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-maroon/20 md:left-1/2" />
          <div className="space-y-12">
            {items.map((item, index) => (
              <div
                key={item.year}
                className={`relative flex flex-col items-start gap-4 md:flex-row md:items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                  }`}
                >
                  <Card className="border-gray-200 p-6 shadow-sm">
                    <span className="text-maroon font-bold text-sm">
                      {item.year}
                    </span>
                    <h3 className="mt-1 font-serif font-bold text-lg text-dark-text">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </Card>
                </div>
                <div className="absolute left-4 z-10 flex size-8 items-center justify-center rounded-full border-4 border-white bg-maroon text-xs font-bold text-white md:left-1/2 md:-translate-x-1/2">
                  {index + 1}
                </div>
                <div className="hidden w-1/2 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
