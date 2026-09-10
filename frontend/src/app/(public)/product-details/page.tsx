import React from "react";
import Link from "next/link";
import Image from "next/image";


export default function ProductDetailsPage() {
  return (
    <>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="h-96 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
                alt="Chicken Achar"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="h-20 bg-white border border-maroon rounded-lg overflow-hidden cursor-pointer relative">
                <Image
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200"
                  alt="Chicken Achar thumbnail 1"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="h-20 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer opacity-70 relative">
                <Image
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200"
                  alt="Chicken Achar thumbnail 2"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold text-sm">★★★★★</span>
                <span className="text-xs font-bold text-darkText">4.8 (12 Reviews)</span>
              </div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-darkText">
                Chicken Achar
              </h1>
              <p className="text-maroon font-bold text-2xl mt-2">
                NPR 350 <span className="text-xs text-gray-500 font-normal">/ 500g</span>
              </p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Rich and savory bone-in chicken pieces simmered in aromatic mustard oil, garlic paste, red chillies, and traditional Nepali spices. Crafted with care in Itahari for an authentic homemade taste.
            </p>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white">
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition">
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-semibold">1</span>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition">
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/cart"
                  className="flex-1 py-3.5 bg-maroon text-white font-medium rounded-lg text-center hover:bg-maroon-hover transition shadow-sm"
                >
                  Add to Cart
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 py-3.5 bg-gold text-maroon font-bold rounded-lg text-center hover:brightness-110 transition shadow-sm"
                >
                  Buy Now
                </Link>
              </div>
            </div>

            {/* Product Details Accordions / Sections */}
            <div className="space-y-4 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <div>
                <h4 className="font-bold text-darkText mb-1">Ingredients</h4>
                <p>
                  Chicken pieces, mustard oil, garlic, ginger, red chili powder, fenugreek, turmeric, salt, and proprietary spice mix.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-darkText mb-1">Storage Information</h4>
                <p>
                  Store in a cool, dry place. Use a clean, dry spoon for serving. Keep tightly sealed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>


     
    </>
  );
}