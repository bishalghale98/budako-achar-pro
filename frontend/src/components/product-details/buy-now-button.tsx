import Link from "next/link";

interface BuyNowButtonProps {
  href?: string;
}

export function BuyNowButton({ href = "/checkout" }: BuyNowButtonProps) {
  return (
    <Link
      href={href}
      className="flex-1 py-3.5 bg-gold text-maroon font-bold rounded-lg text-center hover:brightness-110 transition shadow-sm"
    >
      Buy Now
    </Link>
  );
}
