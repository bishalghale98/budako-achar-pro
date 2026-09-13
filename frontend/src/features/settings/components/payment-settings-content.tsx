"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAdminPaymentSettingsQuery,
  useUpdatePaymentSettingsMutation,
} from "@/features/settings/settings-api";
import type { PaymentSettings } from "@/features/settings/settings-types";

type PaymentSettingsFormValues = Omit<PaymentSettings, "id" | "created_at" | "updated_at" | "digital_payment_qr_image" | "bank_qr_image">;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getImageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}/storage/${path}`;
}

export function PaymentSettingsContent() {
  const { data: settingsData, isLoading } = useGetAdminPaymentSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdatePaymentSettingsMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digitalQrRef = useRef<HTMLInputElement>(null);
  const bankQrRef = useRef<HTMLInputElement>(null);

  const settings = settingsData?.payment_settings;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentSettingsFormValues>({
    defaultValues: {
      digital_payment_account_name: "",
      digital_payment_wallet_number: "",
      bank_name: "",
      bank_account_name: "",
      bank_account_number: "",
      bank_branch: "",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        digital_payment_account_name: settings.digital_payment_account_name ?? "",
        digital_payment_wallet_number: settings.digital_payment_wallet_number ?? "",
        bank_name: settings.bank_name ?? "",
        bank_account_name: settings.bank_account_name ?? "",
        bank_account_number: settings.bank_account_number ?? "",
        bank_branch: settings.bank_branch ?? "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: PaymentSettingsFormValues) => {
    setSuccess(false);
    setError(null);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (digitalQrRef.current?.files?.[0]) {
        formData.append("digital_payment_qr_image", digitalQrRef.current.files[0]);
      }
      if (bankQrRef.current?.files?.[0]) {
        formData.append("bank_qr_image", bankQrRef.current.files[0]);
      }

      await updateSettings(formData).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update payment settings.");
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading payment settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <Alert>
          <AlertDescription>Payment settings updated successfully.</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Digital Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Payment (eSewa / Khalti)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="digital_payment_account_name">Account Name</Label>
              <Input id="digital_payment_account_name" {...register("digital_payment_account_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="digital_payment_wallet_number">Wallet Number</Label>
              <Input id="digital_payment_wallet_number" {...register("digital_payment_wallet_number")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>QR Code Image</Label>
            {settings?.digital_payment_qr_image && (
              <div className="mb-2">
                <img src={getImageUrl(settings.digital_payment_qr_image)} alt="Current QR code" className="h-32 w-32 object-contain rounded" />
              </div>
            )}
            <input ref={digitalQrRef} type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-maroon/10 file:text-maroon hover:file:bg-maroon/20" />
            <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP. Max 2MB.</p>
          </div>
        </CardContent>
      </Card>

      {/* Bank Transfer */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input id="bank_name" {...register("bank_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank_branch">Branch</Label>
              <Input id="bank_branch" {...register("bank_branch")} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_account_name">Account Name</Label>
              <Input id="bank_account_name" {...register("bank_account_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank_account_number">Account Number</Label>
              <Input id="bank_account_number" {...register("bank_account_number")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>QR Code Image</Label>
            {settings?.bank_qr_image && (
              <div className="mb-2">
                <img src={getImageUrl(settings.bank_qr_image)} alt="Current bank QR code" className="h-32 w-32 object-contain rounded" />
              </div>
            )}
            <input ref={bankQrRef} type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-maroon/10 file:text-maroon hover:file:bg-maroon/20" />
            <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP. Max 2MB.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="bg-maroon hover:bg-maroon-hover">
          {isSaving ? "Saving..." : "Save Payment Settings"}
        </Button>
      </div>
    </form>
  );
}
