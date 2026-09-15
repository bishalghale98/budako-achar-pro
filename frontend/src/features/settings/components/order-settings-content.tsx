"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAdminOrderSettingsQuery,
  useUpdateOrderSettingsMutation,
} from "@/features/settings/settings-api";

interface OrderSettingsFormValues {
  delivery_fee: number;
  free_delivery_threshold: number | null;
  minimum_order_amount: number | null;
}

export function OrderSettingsContent() {
  const { data: settingsData, isLoading } = useGetAdminOrderSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateOrderSettingsMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settings = settingsData?.order_settings;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderSettingsFormValues>({
    defaultValues: {
      delivery_fee: 100,
      free_delivery_threshold: null,
      minimum_order_amount: null,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        delivery_fee: settings.delivery_fee,
        free_delivery_threshold: settings.free_delivery_threshold,
        minimum_order_amount: settings.minimum_order_amount,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: OrderSettingsFormValues) => {
    setSuccess(false);
    setError(null);

    try {
      await updateSettings({
        delivery_fee: data.delivery_fee,
        free_delivery_threshold: data.free_delivery_threshold || null,
        minimum_order_amount: data.minimum_order_amount || null,
      }).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = (err && typeof err === "object" && "data" in err)
        ? String((err.data as Record<string, unknown>)?.message ?? "Failed to update order settings.")
        : "Failed to update order settings.";
      setError(message);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading order settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <Alert>
          <AlertDescription>Order settings updated successfully.</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order & Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_fee">Delivery Fee (NPR) *</Label>
              <Input
                id="delivery_fee"
                type="number"
                step="0.01"
                min="0"
                {...register("delivery_fee", { required: "Required", valueAsNumber: true })}
              />
              {errors.delivery_fee && (
                <p className="text-sm text-destructive">{errors.delivery_fee.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="free_delivery_threshold">Free Delivery Threshold (NPR)</Label>
              <Input
                id="free_delivery_threshold"
                type="number"
                step="0.01"
                min="0"
                {...register("free_delivery_threshold", { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Leave empty to disable.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimum_order_amount">Minimum Order Amount (NPR)</Label>
              <Input
                id="minimum_order_amount"
                type="number"
                step="0.01"
                min="0"
                {...register("minimum_order_amount", { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Leave empty for no minimum.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="bg-maroon hover:bg-maroon-hover">
          {isSaving ? "Saving..." : "Save Order Settings"}
        </Button>
      </div>
    </form>
  );
}
