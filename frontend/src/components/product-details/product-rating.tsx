interface ProductRatingProps {
  rating: number;
  reviewCount: number;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className="text-gold text-sm">
      {"★".repeat(full)}
      {hasHalf && "★"}
      {"☆".repeat(empty)}
    </span>
  );
}

export function ProductRating({ rating, reviewCount }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <StarRating rating={rating} />
      <span className="text-xs font-bold text-foreground">
        {rating} ({reviewCount} Reviews)
      </span>
    </div>
  );
}
