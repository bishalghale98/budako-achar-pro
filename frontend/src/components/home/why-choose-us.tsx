import { whyChooseUsSteps } from "@/data/home";

export function WhyChooseUs() {
  return (
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
        {whyChooseUsSteps.map((feature) => (
          <div
            key={feature.number}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="w-12 h-12 bg-maroon/10 text-maroon rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              {feature.number}
            </div>
            <h3 className="font-serif font-bold text-lg text-darkText mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
