import Link from "next/link";

export function CTASection() {
  return (
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
  );
}
