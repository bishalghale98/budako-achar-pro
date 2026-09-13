"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCartQuery } from "@/features/cart";
import { usePlaceOrderMutation } from "@/features/order";
import { checkoutPage } from "@/data/checkout";
import { CustomerForm } from "@/components/checkout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCartQuery();
  const [placeOrder, { isLoading: isSubmitting, error }] =
    usePlaceOrderMutation();

  const cart = data?.cart;
  const items = cart?.items ?? [];
  const deliveryFee = cart?.delivery_fee ?? 0;
  const total = cart?.total ?? 0;

  const handleSubmit = async (formData: {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    address_id?: string;
    address_line?: string;
    area?: string;
    city?: string;
    province?: string;
    delivery_notes?: string;
    payment_method: string;
    payment_proof?: File | null;
  }) => {
    const body = new FormData();
    body.append("customer_name", formData.customer_name);
    body.append("customer_phone", formData.customer_phone);
    body.append("customer_email", formData.customer_email);
    body.append("payment_method", formData.payment_method);

    if (formData.address_id) {
      body.append("address_id", formData.address_id);
    } else {
      body.append("address_line", formData.address_line ?? "");
      if (formData.area) body.append("area", formData.area);
      body.append("city", formData.city ?? "");
      body.append("province", formData.province ?? "");
      if (formData.delivery_notes) {
        body.append("delivery_notes", formData.delivery_notes);
      }
    }

    if (formData.payment_proof) {
      body.append("payment_proof", formData.payment_proof);
    }

    const result = await placeOrder(body).unwrap();
    router.push(`/order-success?order=${result.order.order_number}`);
  };

  const serverError = (error as { data?: { message?: string } })?.data
    ?.message;

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
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            serverError={serverError}
          />
        </div>

        <div className=" sm:bg-card p-0 sm:p-6 rounded-none sm:rounded-xl border-0 sm:border border-border shadow-none sm:shadow-sm h-fit space-y-4">
          <h3 className="font-serif font-bold text-lg text-darkText">
            Order Summary
          </h3>

          {isLoading ? (
            <div className="space-y-3 pt-2 border-t border-border">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : isError || items.length === 0 ? (
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Link
                href="/products"
                className="text-sm text-maroon hover:underline mt-2 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground pt-2 border-t border-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
                    {item.product.thumbnail_url ? (
                      <Image
                        src={item.product.thumbnail_url}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[8px]">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-darkText truncate">
                      {item.product.title} ({item.variant.name})
                    </p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <span className="font-medium text-darkText">
                    NPR {item.subtotal}
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>NPR {deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-darkText text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-maroon">NPR {total}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
