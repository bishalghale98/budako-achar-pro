export interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentMethod {
  id: string;
  label: string;
}

export const checkoutItems: CheckoutItem[] = [
  { name: "Chicken Achar", quantity: 1, price: 350 },
  { name: "Buff Achar", quantity: 1, price: 400 },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "cod", label: "Cash on Delivery (COD)" },
  { id: "digital", label: "eSewa / Khalti / QR Payment" },
  { id: "bank", label: "Bank Transfer" },
];

export const checkoutPage = {
  heading: "Checkout",
  formTitle: "Customer & Delivery Information",
  deliveryFee: 100,
  defaultCity: "Itahari",
  defaultProvince: "Koshi Province",
};
