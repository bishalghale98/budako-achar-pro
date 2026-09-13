"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Address, AddressFormValues } from "@/features/address/address-types";

const addressSchema = z.object({
  label: z.string().min(1, "Label is required").max(50),
  address_line: z.string().min(1, "Street address is required").max(255),
  area: z.string().max(255).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  province: z.string().min(1, "Province is required").max(100),
  phone: z.string().min(1, "Phone number is required").max(20),
  delivery_notes: z.string().max(500).optional().or(z.literal("")),
  is_default: z.boolean(),
});

type AddressSchemaValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormValues) => Promise<void>;
  address?: Address | null;
  isSubmitting?: boolean;
}

const labelOptions = ["Home", "Office", "College", "Other"];

export function AddressForm({
  open,
  onOpenChange,
  onSubmit,
  address,
  isSubmitting,
}: AddressFormProps) {
  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddressSchemaValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      address_line: "",
      area: "",
      city: "Itahari",
      province: "Koshi Province",
      phone: "",
      delivery_notes: "",
      is_default: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (address) {
        reset({
          label: address.label,
          address_line: address.address_line,
          area: address.area ?? "",
          city: address.city,
          province: address.province,
          phone: address.phone,
          delivery_notes: address.delivery_notes ?? "",
          is_default: address.is_default,
        });
      } else {
        reset({
          label: "",
          address_line: "",
          area: "",
          city: "Itahari",
          province: "Koshi Province",
          phone: "",
          delivery_notes: "",
          is_default: false,
        });
      }
    }
  }, [open, address, reset]);

  const handleFormSubmit = async (data: AddressSchemaValues) => {
    await onSubmit({
      ...data,
      area: data.area || "",
      delivery_notes: data.delivery_notes || "",
    });
  };

  const inputClass = (hasError: boolean) =>
    hasError ? "border-destructive" : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-bold text-darkText">
            {isEditing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Label
            </Label>
            <div className="flex gap-2">
              {labelOptions.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setValue("label", l, { shouldValidate: true })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                    watch("label") === l
                      ? "border-maroon bg-maroon text-white"
                      : "border-border bg-background text-muted-foreground hover:border-maroon/50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {errors.label && (
              <p className="text-xs text-destructive">{errors.label.message}</p>
            )}
          </div>

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
              <p className="text-xs text-destructive">{errors.address_line.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="area" className="text-xs font-bold uppercase text-muted-foreground">
              Area / Tole (Optional)
            </Label>
            <Input
              id="area"
              placeholder="e.g. ILB area"
              {...register("area")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                <p className="text-xs text-destructive">{errors.city.message}</p>
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
                <p className="text-xs text-destructive">{errors.province.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-bold uppercase text-muted-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="98XXXXXXXX"
              className={inputClass(!!errors.phone)}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="delivery_notes" className="text-xs font-bold uppercase text-muted-foreground">
              Delivery Notes (Optional)
            </Label>
            <Textarea
              id="delivery_notes"
              rows={2}
              placeholder="Special instructions for delivery"
              {...register("delivery_notes")}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              className="rounded border-border"
              {...register("is_default")}
            />
            <Label htmlFor="is_default" className="text-sm font-medium text-muted-foreground cursor-pointer">
              Set as default address
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-maroon text-white hover:bg-maroon-hover"
            >
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                  ? "Save Changes"
                  : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
