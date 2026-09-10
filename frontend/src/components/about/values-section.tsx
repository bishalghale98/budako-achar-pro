import { Card } from "@/components/ui/card";
import type { ValueItem } from "@/data/about";

interface ValuesSectionProps {
  items: ValueItem[];
}

export function ValuesSection({ items }: ValuesSectionProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
            Our Values
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-dark-text">
            What We Stand For
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((value) => (
            <Card
              key={value.title}
              className="border-gray-200 p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-maroon/10 text-maroon">
                <value.icon className="size-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-dark-text">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {value.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
