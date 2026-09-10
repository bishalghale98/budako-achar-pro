import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Leaf, Award } from "lucide-react";

const timeline = [
  {
    year: "1995",
    title: "The Beginning",
    description:
      "Grandmother started making achar in her small kitchen in Kathmandu, using recipes passed down for generations.",
  },
  {
    year: "2005",
    title: "Family Tradition",
    description:
      "The recipes were handed down to the next generation, preserving the authentic flavors and traditional methods.",
  },
  {
    year: "2015",
    title: "Buda Ko Achar Founded",
    description:
      "What was a family tradition became a brand. We started sharing our achar with friends and neighbors.",
  },
  {
    year: "2020",
    title: "Growing Nationwide",
    description:
      "With increasing demand, we expanded our kitchen and started delivering across Nepal.",
  },
  {
    year: "Today",
    title: "Serving Thousands",
    description:
      "Buda Ko Achar now serves thousands of happy customers, bringing authentic Nepali flavors to tables nationwide.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every jar is crafted with the same love and care as our grandmother's kitchen.",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description: "We use only the finest, locally-sourced ingredients with no artificial preservatives.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We support local farmers and communities through fair trade practices.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Our strict quality standards ensure you get the best product every time.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon/5 via-white to-gold/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
                About Us
              </span>
              <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-dark-text sm:text-4xl lg:text-5xl">
                A Legacy of Authentic Nepali Flavors
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Buda Ko Achar is more than a brand — it's a story of tradition,
                love, and the authentic taste of Nepal. What started in a small
                kitchen has become a beloved name in Nepali households.
              </p>
            </div>
            <div className="relative">
              <div className="h-80 overflow-hidden rounded-2xl bg-gray-100 sm:h-96">
                <img
                  src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
                  alt="Our kitchen"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="h-80 overflow-hidden rounded-2xl bg-gray-100 sm:h-96">
                <img
                  src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
                  alt="Our story"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
                Our Story
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-dark-text">
                From Grandma's Kitchen to Your Table
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                In the heart of Kathmandu, our grandmother spent her mornings in
                a small kitchen, grinding spices and mixing ingredients to create
                the most flavorful achar. Her secret? Love, patience, and recipes
                that had been perfected over generations.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                When she passed these recipes to her children, they carried forward
                not just a tradition, but a legacy. Today, Buda Ko Achar honors
                that legacy by bringing you the same authentic taste, made with
                the same dedication and care.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We believe that food is more than sustenance — it's a connection
                to our roots, our culture, and our loved ones. Every jar of our
                achar carries a piece of that tradition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
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
              {timeline.map((item, index) => (
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

      {/* Values */}
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
            {values.map((value) => (
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

      {/* CTA */}
      <section className="bg-maroon py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Taste the Difference
          </h2>
          <p className="mt-4 text-gray-200 max-w-xl mx-auto">
            Experience the authentic flavors of traditional Nepali achar. Order
            now and bring home the taste of tradition.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-gold px-8 py-4 font-bold text-maroon shadow transition hover:brightness-110"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}
