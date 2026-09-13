import { testimonials } from "@/data/home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {testimonials.map((t, index) => (
              <CarouselItem key={`${t.name}-${index}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <TestimonialCard {...t} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  );
}
