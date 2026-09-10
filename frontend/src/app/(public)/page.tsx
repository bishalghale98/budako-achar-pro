import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  BookOpen,
  CheckCircle,
  MapPin,
  ArrowRight,

} from "lucide-react";

export default function Home() {
  return (
    <>

        {/* HERO SECTION */}
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
                Traditional flavors, bold spices, and homemade goodness in every bite, carefully prepared at Sangeet Chowk, Itahari.
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
              <div className="absolute -inset-1 bg-linear-to-r from-gold to-maroon rounded-2xl blur-lg opacity-25"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
                <div className="h-80 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative">
                  <Image
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
                    alt="Buda Ko Achar Jar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-semibold text-maroon shadow">
                    Traditional Glass Jar · 500g
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg">Signature Chicken Achar</h3>
                    <p className="text-xs text-gray-500">Rich spices & authentic flavor</p>
                  </div>
                  <span className="text-maroon font-bold text-lg">NPR 350</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST / BRAND VALUES */}
        <section className="bg-white border-y border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 text-gold flex items-center justify-center bg-gold/10 rounded-full font-bold">
                ★
              </div>
              <h4 className="font-bold text-darkText">4.2 / 5 Rating</h4>
              <p className="text-xs text-gray-500 mt-1">Based on 23 reviews</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 text-maroon flex items-center justify-center bg-maroon/10 rounded-full">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-darkText">Traditional Taste</h4>
              <p className="text-xs text-gray-500 mt-1">Authentic regional recipes</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 text-maroon flex items-center justify-center bg-maroon/10 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-darkText">Quality Ingredients</h4>
              <p className="text-xs text-gray-500 mt-1">Carefully selected spices</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 text-maroon flex items-center justify-center bg-maroon/10 rounded-full">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-darkText">Itahari, Nepal</h4>
              <p className="text-xs text-gray-500 mt-1">Sangeet Chowk base</p>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
                Handcrafted Collection
              </span>
              <h2 className="font-serif text-3xl font-bold text-darkText mt-1">
                Our Popular Achar
              </h2>
              <p className="text-gray-600 mt-1">Traditional flavors made for every Nepali table.</p>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 text-maroon font-semibold hover:underline inline-flex items-center gap-1"
            >
              View All Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="h-60 bg-gray-100 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600"
                    alt="Chicken Achar"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm">
                  500g
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-gold text-sm mb-1">
                  <span>★</span> <span className="text-darkText font-bold text-xs">4.8</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-darkText">Chicken Achar</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  Rich, spicy, and deeply savory bone-in or boneless chicken pieces steeped in traditional mustard oil and local spices.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-maroon text-lg">NPR 350</span>
                  <Link
                    href="/product-details"
                    className="px-4 py-2 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition"
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="h-60 bg-gray-100 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600"
                    alt="Buff Achar"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm">
                  500g
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-gold text-sm mb-1">
                  <span>★</span> <span className="text-darkText font-bold text-xs">4.7</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-darkText">Buff Achar</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  Chewy, flavorful buffalo meat cured with robust Himalayan spices and pungent garlic-ginger paste.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-maroon text-lg">NPR 400</span>
                  <Link
                    href="/product-details"
                    className="px-4 py-2 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition"
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="h-60 bg-gray-100 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=600"
                    alt="Mutton Achar"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm">
                  500g
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-gold text-sm mb-1">
                  <span>★</span> <span className="text-darkText font-bold text-xs">4.9</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-darkText">Mutton Achar</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  Premium tender mutton cuts simmered in thick aromatic gravies and sun-dried spices.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-maroon text-lg">NPR 450</span>
                  <Link
                    href="/product-details"
                    className="px-4 py-2 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition"
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND STORY SECTION */}
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
                Traditional flavors, familiar spices, and the kind of achar that brings every meal closer to home. Prepared with traditional methods in Itahari, Buda Ko Achar brings authentic Nepali zest straight to your dining table.
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
                  src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"
                  alt="Nepali spices and jar"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* WHY BUDA KO ACHAR */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl font-bold text-darkText mt-1">
              Why Choose Buda Ko Achar?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-maroon/10 text-maroon rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                01
              </div>
              <h3 className="font-serif font-bold text-lg text-darkText mb-2">Traditional Taste</h3>
              <p className="text-gray-600 text-sm">
                Crafted using age-old recipes passed down through generations of home cooks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-maroon/10 text-maroon rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                02
              </div>
              <h3 className="font-serif font-bold text-lg text-darkText mb-2">Made With Care</h3>
              <p className="text-gray-600 text-sm">
                Every batch is prepared with meticulous attention to hygiene, quality, and flavor balance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-maroon/10 text-maroon rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                03
              </div>
              <h3 className="font-serif font-bold text-lg text-darkText mb-2">Bold Nepali Flavors</h3>
              <p className="text-gray-600 text-sm">
                Uses genuine local timur, mustard oil, garlic, and robust chilly blends.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-maroon/10 text-maroon rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                04
              </div>
              <h3 className="font-serif font-bold text-lg text-darkText mb-2">Perfect With Every Meal</h3>
              <p className="text-gray-600 text-sm">
                Complements dal bhat, snacks, rotis, and everyday dining perfectly.
              </p>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
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
              {/* Review 1 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-gold text-sm mb-3">★★★★★</div>
                  <p className="text-gray-700 italic">
                    &quot;Tastes exactly like home! Perfectly spiced and incredibly flavorful.&quot;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-darkText text-sm">Aarogya Subedi</span>
                  <span className="text-xs text-gray-400">1 month ago</span>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-gold text-sm mb-3">★★★★★</div>
                  <p className="text-gray-700 italic">
                    &quot;Hello and namaste maya dd and vinaju! I bought chicken buda ko achar which is very delicious hai.&quot;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-darkText text-sm">Dristi Gc</span>
                  <span className="text-xs text-gray-400">4 months ago</span>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-gold text-sm mb-3">★★★★☆</div>
                  <p className="text-gray-700 italic">
                    &quot;The meat achar was a little too spicy and oily for my liking, but the authentic flavor is undeniable.&quot;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-darkText text-sm">dAwA</span>
                  <span className="text-xs text-gray-400">5 months ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-maroon py-16 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Bring Home the Taste of Nepali Achar
            </h2>
            <p className="text-gray-200 max-w-xl mx-auto mb-8">
              Discover traditional flavors made for everyday meals.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-gold text-maroon font-bold rounded-lg shadow hover:brightness-110 transition"
            >
              Shop Achar
            </Link>
          </div>
        </section>


      
    </>
  );
}