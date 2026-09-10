import Link from "next/link";
import type { CheckoutItem } from "@/data/checkout";

interface CheckoutSummaryProps {
  items: CheckoutItem[];
  deliveryFee: number;
}

export function CheckoutSummary({ items, deliveryFee }: CheckoutSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
      <h3 className="font-serif font-bold text-lg text-darkText">
        Order Summary
      </h3>
      <div className="space-y-3 text-sm text-gray-600 pt-2 border-t border-gray-100">
        {items.map((item) => (
          <div key={item.name} className="flex justify-between">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>NPR {item.price * item.quantity}</span>
          </div>
        ))}
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
        href="/order-success"
        className="block w-full py-3.5 bg-maroon text-white font-medium text-center rounded-lg hover:bg-maroon-hover transition shadow-sm"
      >
        Place Order
      </Link>
    </div>
  );
}
