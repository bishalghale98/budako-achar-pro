import Link from "next/link";

interface OrderSuccessCardProps {
  orderId: string;
  message: string;
  brandName: string;
  deliveryNote: string;
  trackButton: string;
  trackLink: string;
  continueButton: string;
  continueLink: string;
}

export function OrderSuccessCard({
  orderId,
  message,
  brandName,
  deliveryNote,
  trackButton,
  trackLink,
  continueButton,
  continueLink,
}: OrderSuccessCardProps) {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-darkText">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {message}{" "}
            <span className="font-semibold text-maroon">{brandName}</span>.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-1">
          <p className="text-gray-500">Order ID</p>
          <p className="font-bold text-darkText">{orderId}</p>
        </div>
        <p className="text-xs text-gray-500">{deliveryNote}</p>
        <div className="space-y-3 pt-2">
          <Link
            href={trackLink}
            className="block w-full py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition text-sm text-center"
          >
            {trackButton}
          </Link>
          <Link
            href={continueLink}
            className="block w-full py-3 bg-gray-100 text-darkText font-medium rounded-lg hover:bg-gray-200 transition text-sm text-center"
          >
            {continueButton}
          </Link>
        </div>
      </div>
    </main>
  );
}
