interface TestimonialCardProps {
  stars: number;
  text: string;
  name: string;
  time: string;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="text-gold text-sm mb-3">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </div>
  );
}

export function TestimonialCard({ stars, text, name, time }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <StarRating count={stars} />
        <p className="text-gray-700 italic">&quot;{text}&quot;</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="font-semibold text-darkText text-sm">{name}</span>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    </div>
  );
}
