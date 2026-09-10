import { OrderSuccessCard } from "@/components/order-success";
import { orderSuccessData } from "@/data/order-success";

export default function OrderSuccessPage() {
  return (
    <div className="font-sans bg-lightBg text-darkText antialiased flex flex-col min-h-screen">
      <OrderSuccessCard
        orderId={orderSuccessData.orderId}
        message={orderSuccessData.message}
        brandName={orderSuccessData.brandName}
        deliveryNote={orderSuccessData.deliveryNote}
        trackButton={orderSuccessData.trackButton}
        trackLink={orderSuccessData.trackLink}
        continueButton={orderSuccessData.continueButton}
        continueLink={orderSuccessData.continueLink}
      />
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-gray-200">
        {orderSuccessData.footer}
      </footer>
    </div>
  );
}
