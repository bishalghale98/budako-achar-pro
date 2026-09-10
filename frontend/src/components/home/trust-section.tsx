import { BookOpen, CheckCircle, MapPin } from "lucide-react";
import { trustItems } from "@/data/home";

const iconMap = {
  star: <span className="font-bold text-lg">★</span>,
  book: <BookOpen className="w-5 h-5" />,
  check: <CheckCircle className="w-5 h-5" />,
  map: <MapPin className="w-5 h-5" />,
};

export function TrustSection() {
  return (
    <section className="bg-white border-y border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {trustItems.map((item) => (
          <div key={item.label} className="p-4">
            <div
              className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full ${
                item.icon === "star"
                  ? "text-gold bg-gold/10"
                  : "text-maroon bg-maroon/10"
              }`}
            >
              {iconMap[item.icon as keyof typeof iconMap]}
            </div>
            <h4 className="font-bold text-darkText">{item.label}</h4>
            <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
