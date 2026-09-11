"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { PaymentMethodRadio } from "./payment-method";
import { PaymentProofUpload } from "./payment-proof-upload";

const checkoutSchema = z
  .object({
    customer_name: z.string().min(1, "Full name is required"),
    customer_phone: z.string().min(1, "Phone number is required"),
    customer_email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    address_line: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    delivery_notes: z.string().optional(),
    payment_method: z.enum(["cod", "digital", "bank"]),
    payment_proof: z.custom<File | null>().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.payment_method !== "cod" && !data.payment_proof) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment screenshot is required for this method",
        path: ["payment_proof"],
      });
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CustomerFormProps {
  defaultCity: string;
  defaultProvince: string;
  onSubmit: (data: CheckoutFormValues) => Promise<void>;
  isSubmitting: boolean;
  serverError?: string;
}

const paymentMethods = [
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    description: "Pay when your order arrives",
  },
  {
    id: "digital",
    label: "eSewa / Khalti / QR Payment",
    description: "Scan QR code and upload payment screenshot",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Transfer to our bank account and upload screenshot",
  },
];

export function CustomerForm({
  defaultCity,
  defaultProvince,
  onSubmit,
  isSubmitting,
  serverError,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      address_line: "",
      city: defaultCity,
      province: defaultProvince,
      delivery_notes: "",
      payment_method: "cod",
      payment_proof: null,
    },
  });

  const paymentMethod = watch("payment_method");

  const handleFormSubmit = async (data: CheckoutFormValues) => {
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string; errors?: Record<string, string[]> };
      };
      if (apiError?.data?.errors) {
        for (const [field, messages] of Object.entries(
          apiError.data.errors,
        )) {
          setError(field as keyof CheckoutFormValues, {
            type: "server",
            message: messages[0],
          });
        }
      }
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg text-sm text-darkText focus:outline-none focus:border-maroon transition ${
      hasError ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h2 className="font-serif text-xl font-bold text-darkText">
        Customer & Delivery Information
      </h2>

      {serverError && !Object.keys(errors).length && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              className={inputClass(!!errors.customer_name)}
              {...register("customer_name")}
            />
            {errors.customer_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.customer_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="98XXXXXXXX"
              className={inputClass(!!errors.customer_phone)}
              {...register("customer_phone")}
            />
            {errors.customer_phone && (
              <p className="text-xs text-red-500 mt-1">
                {errors.customer_phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputClass(!!errors.customer_email)}
            {...register("customer_email")}
          />
          {errors.customer_email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.customer_email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Street Address
          </label>
          <input
            type="text"
            placeholder="e.g. Sangeet Chowk"
            className={inputClass(!!errors.address_line)}
            {...register("address_line")}
          />
          {errors.address_line && (
            <p className="text-xs text-red-500 mt-1">
              {errors.address_line.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              City
            </label>
            <input
              type="text"
              className={inputClass(!!errors.city)}
              {...register("city")}
            />
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">
                {errors.city.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Province
            </label>
            <input
              type="text"
              className={inputClass(!!errors.province)}
              {...register("province")}
            />
            {errors.province && (
              <p className="text-xs text-red-500 mt-1">
                {errors.province.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Delivery Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Special instructions for delivery"
            className={inputClass(!!errors.delivery_notes)}
            {...register("delivery_notes")}
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <PaymentMethodRadio
            methods={paymentMethods}
            selected={paymentMethod}
            onChange={(val) => setValue("payment_method", val as "cod" | "digital" | "bank")}
            error={errors.payment_method?.message}
          />
        </div>

        {paymentMethod !== "cod" && (
          <div className="pt-4 border-t border-gray-100">
            <PaymentProofUpload
              value={watch("payment_proof") ?? null}
              onChange={(file) => setValue("payment_proof", file, { shouldValidate: true })}
              error={errors.payment_proof?.message}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm disabled:opacity-60"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
