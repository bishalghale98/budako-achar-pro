import Link from "next/link";

interface AddToCartButtonProps {
  href?: string;
}

export function AddToCartButton({ href = "/cart" }: AddToCartButtonProps) {
  return (
    <Link
      href={href}
      className="flex-1 py-3.5 bg-maroon text-white font-medium rounded-lg text-center hover:bg-maroon-hover transition shadow-sm"
    >
      Add to Cart
    </Link>
  );
}
