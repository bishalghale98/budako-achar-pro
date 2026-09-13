"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentMethodRadio } from "./payment-method";
import { PaymentProofUpload } from "./payment-proof-upload";
import { checkoutSchema, type CheckoutFormValues } from "./checkout-schema";
import { AddressSelector } from "@/components/address/address-selector";
import { useGetAddressesQuery } from "@/features/address/address-api";
import { useUser } from "@/features/auth/auth-hooks";

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
  const user = useUser();
  const { data: addressData, isLoading: addressesLoading } = useGetAddressesQuery();
  const addresses = useMemo(() => addressData?.addresses ?? [], [addressData?.addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useDifferent, setUseDifferent] = useState(false);
  const [manualAddress, setManualAddress] = useState<Record<string, string>>({
    address_line: "",
    area: "",
    city: defaultCity,
    province: defaultProvince,
    delivery_notes: "",
  });
  const [manualAddressErrors, setManualAddressErrors] = useState<Record<string, string>>({});

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
      address_id: undefined,
      address_line: "",
      area: "",
      city: defaultCity,
      province: defaultProvince,
      delivery_notes: "",
      payment_method: "cod",
      payment_proof: null,
    },
  });

  // Auto-fill from logged-in user
  useEffect(() => {
    if (user) {
      setValue("customer_name", user.name, { shouldValidate: true });
      setValue("customer_email", user.email, { shouldValidate: true });
    }
  }, [user, setValue]);

  // Initialize default address selection once addresses load
  useEffect(() => {
    if (addressesLoading || !user) return;
    if (addresses.length === 0) {
      setUseDifferent(true);
      setSelectedAddressId(null);
      setValue("address_id", undefined, { shouldValidate: true });
    } else if (!selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setValue("address_id", defaultAddr.id, { shouldValidate: true });
    }
  }, [addresses, addressesLoading, user, selectedAddressId, setValue]);

  const paymentMethod = watch("payment_method");

  const handleAddressSelect = useCallback((id: string) => {
    setSelectedAddressId(id);
    setUseDifferent(false);
    setValue("address_id", id, { shouldValidate: true });
  }, [setValue]);

  const handleUseDifferent = useCallback(() => {
    setUseDifferent(true);
    setSelectedAddressId(null);
    setValue("address_id", undefined, { shouldValidate: true });
    setManualAddress((prev) => ({
      ...prev,
      city: defaultCity,
      province: defaultProvince,
    }));
  }, [setValue, defaultCity, defaultProvince]);

  const handleUseSaved = useCallback(() => {
    setUseDifferent(false);
    const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0];
    setSelectedAddressId(defaultAddr.id);
    setValue("address_id", defaultAddr.id, { shouldValidate: true });
  }, [addresses, setValue]);

  const handleManualAddressChange = useCallback((field: string, value: string) => {
    setManualAddress((prev) => ({ ...prev, [field]: value }));
    setValue(field as keyof CheckoutFormValues, value, { shouldValidate: true });
    setManualAddressErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, [setValue]);

  const handleFormSubmit = async (data: CheckoutFormValues) => {
    const newErrors: Record<string, string> = {};

    if (!selectedAddressId) {
      if (!manualAddress.address_line) newErrors.address_line = "Street address is required";
      if (!manualAddress.city) newErrors.city = "City is required";
      if (!manualAddress.province) newErrors.province = "Province is required";

      if (Object.keys(newErrors).length > 0) {
        setManualAddressErrors(newErrors);
        return;
      }
    }

    setManualAddressErrors({});

    const submitData = {
      ...data,
      address_id: selectedAddressId ?? undefined,
      address_line: selectedAddressId ? undefined : manualAddress.address_line,
      area: selectedAddressId ? undefined : manualAddress.area,
      city: selectedAddressId ? undefined : manualAddress.city,
      province: selectedAddressId ? undefined : manualAddress.province,
      delivery_notes: selectedAddressId ? undefined : manualAddress.delivery_notes,
    };

    try {
      await onSubmit(submitData);
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
    hasError ? "border-destructive" : "";

  return (
    <div className=" sm:bg-card p-0 sm:p-8 rounded-none sm:rounded-xl border-0 sm:border border-border shadow-none sm:shadow-sm space-y-6">
      <h2 className="font-serif text-xl font-bold text-darkText">
        Customer & Delivery Information
      </h2>

      {serverError && !Object.keys(errors).length && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="customer_name" className="text-xs font-bold uppercase text-muted-foreground">
              Full Name
            </Label>
            <Input
              id="customer_name"
              placeholder="Your full name"
              className={inputClass(!!errors.customer_name)}
              {...register("customer_name")}
            />
            {errors.customer_name && (
              <p className="text-xs text-destructive">
                {errors.customer_name.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer_phone" className="text-xs font-bold uppercase text-muted-foreground">
              Phone Number
            </Label>
            <Input
              id="customer_phone"
              placeholder="98XXXXXXXX"
              className={inputClass(!!errors.customer_phone)}
              {...register("customer_phone")}
            />
            {errors.customer_phone && (
              <p className="text-xs text-destructive">
                {errors.customer_phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="customer_email" className="text-xs font-bold uppercase text-muted-foreground">
            Email Address
          </Label>
          <Input
            id="customer_email"
            type="email"
            placeholder="you@example.com"
            className={inputClass(!!errors.customer_email)}
            {...register("customer_email")}
          />
          {errors.customer_email && (
            <p className="text-xs text-destructive">
              {errors.customer_email.message}
            </p>
          )}
        </div>

        {user ? (
          <AddressSelector
            addresses={addresses}
            isLoading={addressesLoading}
            selectedId={selectedAddressId}
            onSelect={handleAddressSelect}
            onUseDifferent={handleUseDifferent}
            onUseSaved={handleUseSaved}
            useDifferent={useDifferent}
            onManualAddressChange={handleManualAddressChange}
            defaultCity={defaultCity}
            defaultProvince={defaultProvince}
            manualAddressErrors={manualAddressErrors}
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="address_line" className="text-xs font-bold uppercase text-muted-foreground">
                Street Address
              </Label>
              <Input
                id="address_line"
                placeholder="e.g. Sangeet Chowk"
                className={inputClass(!!errors.address_line)}
                {...register("address_line")}
              />
              {errors.address_line && (
                <p className="text-xs text-destructive">
                  {errors.address_line.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs font-bold uppercase text-muted-foreground">
                  City
                </Label>
                <Input
                  id="city"
                  className={inputClass(!!errors.city)}
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-xs text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="province" className="text-xs font-bold uppercase text-muted-foreground">
                  Province
                </Label>
                <Input
                  id="province"
                  className={inputClass(!!errors.province)}
                  {...register("province")}
                />
                {errors.province && (
                  <p className="text-xs text-destructive">
                    {errors.province.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delivery_notes" className="text-xs font-bold uppercase text-muted-foreground">
                Delivery Notes (Optional)
              </Label>
              <Textarea
                id="delivery_notes"
                rows={2}
                placeholder="Special instructions for delivery"
                className={errors.delivery_notes ? "border-destructive" : ""}
                {...register("delivery_notes")}
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <PaymentMethodRadio
            methods={paymentMethods}
            selected={paymentMethod}
            onChange={(val) => setValue("payment_method", val as "cod" | "digital" | "bank")}
            error={errors.payment_method?.message}
          />
        </div>

        {paymentMethod === "digital" && (
          <Card>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="QR Code"
                  className="rounded-xl object-cover"
                  width={192}
                  height={192}
                />
              </div>
              <div className="space-y-2 text-sm text-center sm:text-left">
                <h4 className="font-bold text-darkText uppercase tracking-wide">
                  eSewa / Khalti Payment
                </h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>
                    <span className="font-medium text-darkText">Account Name:</span>{" "}
                    Budako Achar Udyog
                  </p>
                  <p>
                    <span className="font-medium text-darkText">Wallet Number:</span>{" "}
                    9800000000
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan the QR code or send payment to the number above. Then upload
                  your payment screenshot below.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === "bank" && (
          <Card>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="QR Code"
                  className="rounded-xl object-cover"
                  width={192}
                  height={192}
                />
              </div>
              <div className="space-y-2 text-sm text-center sm:text-left">
                <h4 className="font-bold text-darkText uppercase tracking-wide">
                  Bank Transfer
                </h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>
                    <span className="font-medium text-darkText">Bank:</span>{" "}
                    Global IME Bank
                  </p>
                  <p>
                    <span className="font-medium text-darkText">Account Name:</span>{" "}
                    Budako Achar Udyog
                  </p>
                  <p>
                    <span className="font-medium text-darkText">Account Number:</span>{" "}
                    01234567890123
                  </p>
                  <p>
                    <span className="font-medium text-darkText">Branch:</span>{" "}
                    Biratnagar
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Transfer the exact order amount to the account above. Then upload
                  your payment screenshot below.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod !== "cod" && (
          <div className="pt-4 border-t border-border">
            <PaymentProofUpload
              value={watch("payment_proof") ?? null}
              onChange={(file) => setValue("payment_proof", file, { shouldValidate: true })}
              error={errors.payment_proof?.message}
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm disabled:opacity-60 h-auto"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}
