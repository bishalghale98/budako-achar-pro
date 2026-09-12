export interface PaymentMethod {
  id: string;
  label: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: "cod", label: "Cash on Delivery (COD)" },
  { id: "digital", label: "eSewa / Khalti / QR Payment" },
  { id: "bank", label: "Bank Transfer" },
];

export const checkoutPage = {
  heading: "Checkout",
  formTitle: "Customer & Delivery Information",
  defaultCity: "Itahari",
  defaultProvince: "Koshi Province",
};
