import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  checkoutLink?: string;
  checkoutText?: string;
}

export function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  checkoutLink = "/checkout",
  checkoutText = "Proceed to Checkout",
}: OrderSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
      <h3 className="font-serif font-bold text-lg text-darkText">
        Order Summary
      </h3>
      <div className="space-y-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>NPR {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>NPR {deliveryFee}</span>
        </div>
        <div className="flex justify-between font-bold text-darkText text-base pt-2 border-t border-gray-100">
          <span>Total</span>
          <span className="text-maroon">NPR {total}</span>
        </div>
      </div>
      <Link
        href={checkoutLink}
        className="block w-full py-3.5 bg-maroon text-white font-medium text-center rounded-lg hover:bg-maroon-hover transition shadow-sm"
      >
        {checkoutText}
      </Link>
    </div>
  );
}
