import React from "react";
import Link from "next/link";
import Image from "next/image";


export default function ProductsPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 ">
        <div className="mb-8">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-darkText">
            Our Achar Collection
          </h1>
          <p className="text-gray-600 mt-2">
            Discover our collection of traditional Nepali achar made with authentic spices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-darkText mb-4">
                Categories
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-maroon font-semibold block py-1">
                    All Achar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-maroon block py-1">
                    Meat Achar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-maroon block py-1">
                    Traditional Achar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-maroon block py-1">
                    Vegetarian Achar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-maroon block py-1">
                    Special Achar
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Product Grid Container */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Sort Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Search achar..."
                className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
              />
              <select className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon bg-white">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name</option>
              </select>
            </div>

            {/* Products Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product 1: Chicken Achar */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-52 bg-gray-100 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500"
                    alt="Chicken Achar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-gold text-xs mb-1">
                    <span>★</span> <span className="text-darkText font-bold">4.8</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-darkText">Chicken Achar</h3>
                  <p className="text-gray-500 text-xs mt-1">Rich and spicy home recipe.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-maroon text-sm">
                      NPR 350 <span className="text-xs text-gray-400 font-normal">/ 500g</span>
                    </span>
                    <Link
                      href="/product-details"
                      className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 2: Buff Achar */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-52 bg-gray-100 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
                    alt="Buff Achar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-gold text-xs mb-1">
                    <span>★</span> <span className="text-darkText font-bold">4.7</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-darkText">Buff Achar</h3>
                  <p className="text-gray-500 text-xs mt-1">Chewy buff meat cured with local spices.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-maroon text-sm">
                      NPR 400 <span className="text-xs text-gray-400 font-normal">/ 500g</span>
                    </span>
                    <Link
                      href="/product-details"
                      className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 3: Mutton Achar */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-52 bg-gray-100 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=500"
                    alt="Mutton Achar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-gold text-xs mb-1">
                    <span>★</span> <span className="text-darkText font-bold">4.9</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-darkText">Mutton Achar</h3>
                  <p className="text-gray-500 text-xs mt-1">Premium tender mutton cuts.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-maroon text-sm">
                      NPR 450 <span className="text-xs text-gray-400 font-normal">/ 500g</span>
                    </span>
                    <Link
                      href="/product-details"
                      className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 4: Lapsi Achar */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-52 bg-gray-100 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500"
                    alt="Lapsi Achar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-gold text-xs mb-1">
                    <span>★</span> <span className="text-darkText font-bold">4.6</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-darkText">Lapsi Achar</h3>
                  <p className="text-gray-500 text-xs mt-1">Sweet & tangy hog plum pickle.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-maroon text-sm">
                      NPR 300 <span className="text-xs text-gray-400 font-normal">/ 500g</span>
                    </span>
                    <Link
                      href="/product-details"
                      className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 5: Timur Achar */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-52 bg-gray-100 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=500"
                    alt="Timur Achar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-gold text-xs mb-1">
                    <span>★</span> <span className="text-darkText font-bold">4.8</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-darkText">Timur Achar</h3>
                  <p className="text-gray-500 text-xs mt-1">Pungent citrusy Szechuan pepper pickle.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-maroon text-sm">
                      NPR 280 <span className="text-xs text-gray-400 font-normal">/ 500g</span>
                    </span>
                    <Link
                      href="/product-details"
                      className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 6: Mixed Achar */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-52 bg-gray-100 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500"
                    alt="Mixed Achar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-gold text-xs mb-1">
                    <span>★</span> <span className="text-darkText font-bold">4.7</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-darkText">Mixed Achar</h3>
                  <p className="text-gray-500 text-xs mt-1">Assorted traditional spice blend.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-maroon text-sm">
                      NPR 320 <span className="text-xs text-gray-400 font-normal">/ 500g</span>
                    </span>
                    <Link
                      href="/product-details"
                      className="px-3 py-1.5 bg-maroon text-white text-xs font-medium rounded hover:bg-maroon-hover transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}