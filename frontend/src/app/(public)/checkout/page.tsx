import { PageHeader } from "@/components/shared";
import { CustomerForm, CheckoutSummary } from "@/components/checkout";
import { checkoutItems, paymentMethods, checkoutPage } from "@/data/checkout";

export default function CheckoutPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
        {checkoutPage.heading}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <CustomerForm
            defaultCity={checkoutPage.defaultCity}
            defaultProvince={checkoutPage.defaultProvince}
            paymentMethods={paymentMethods}
          />
        </div>
        <CheckoutSummary
          items={checkoutItems}
          deliveryFee={checkoutPage.deliveryFee}
        />
      </div>
    </main>
  );
}
