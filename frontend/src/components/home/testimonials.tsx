import { testimonials } from "@/data/home";
import { TestimonialCard } from "./testimonial-card";

export function Testimonials() {
  return (
    <section className="bg-gray-100 py-20 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl font-bold text-darkText mt-1">
              What Our Customers Say
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-gold font-bold text-lg">4.2</span>
            <div className="text-gold text-sm">★★★★★</div>
            <span className="text-xs text-gray-500">(23 Reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
