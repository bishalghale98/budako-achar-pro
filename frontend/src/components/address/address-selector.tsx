"use client";

import { Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Address } from "@/features/address/address-types";

interface AddressSelectorProps {
  addresses: Address[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUseDifferent: () => void;
  onUseSaved: () => void;
  useDifferent: boolean;
  onManualAddressChange: (field: string, value: string) => void;
  defaultCity: string;
  defaultProvince: string;
  manualAddressErrors: Record<string, string>;
}

export function AddressSelector({
  addresses,
  isLoading,
  selectedId,
  onSelect,
  onUseDifferent,
  onUseSaved,
  useDifferent,
  onManualAddressChange,
  defaultCity,
  defaultProvince,
  manualAddressErrors,
}: AddressSelectorProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-slate-100 rounded w-40 animate-pulse" />
        <div className="h-16 bg-slate-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (addresses.length === 0) return null;

  const inputClass = (hasError: boolean) =>
    hasError ? "border-destructive" : "";

  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase text-muted-foreground">
        Delivery Address
      </Label>

      {!useDifferent && (
        <div className="space-y-2">
          {addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelect(address.id)}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selectedId === address.id
                  ? "border-maroon bg-maroon/5 shadow-sm"
                  : "border-border hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-darkText">
                    {address.label}
                  </span>
                  {address.is_default && (
                    <Badge
                      variant="secondary"
                      className="bg-maroon/10 text-maroon text-[10px] font-bold"
                    >
                      Default
                    </Badge>
                  )}
                </div>
                {selectedId === address.id && (
                  <Check className="h-4 w-4 text-maroon shrink-0 mt-0.5" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                <p>{address.address_line}</p>
                {address.area && <p>{address.area}</p>}
                <p>
                  {address.city}, {address.province}
                </p>
                <p>{address.phone}</p>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={onUseDifferent}
            className="w-full p-3 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-maroon/50 hover:text-maroon transition flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Use a different address
          </button>
        </div>
      )}

      {useDifferent && (
        <div className="space-y-4 p-3 rounded-xl border border-border bg-slate-50/50">
          <div className="space-y-1.5">
            <Label htmlFor="address_line" className="text-xs font-bold uppercase text-muted-foreground">
              Street Address
            </Label>
            <Input
              id="address_line"
              placeholder="e.g. Sangeet Chowk"
              onChange={(e) => onManualAddressChange("address_line", e.target.value)}
            />
            {manualAddressErrors.address_line && (
              <p className="text-xs text-destructive">{manualAddressErrors.address_line}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="area" className="text-xs font-bold uppercase text-muted-foreground">
              Area / Tole (Optional)
            </Label>
            <Input
              id="area"
              placeholder="e.g. ILB area"
              onChange={(e) => onManualAddressChange("area", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-bold uppercase text-muted-foreground">
                City
              </Label>
              <Input
                id="city"
                defaultValue={defaultCity}
                onChange={(e) => onManualAddressChange("city", e.target.value)}
                className={inputClass(!!manualAddressErrors.city)}
              />
              {manualAddressErrors.city && (
                <p className="text-xs text-destructive">{manualAddressErrors.city}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="province" className="text-xs font-bold uppercase text-muted-foreground">
                Province
              </Label>
              <Input
                id="province"
                defaultValue={defaultProvince}
                onChange={(e) => onManualAddressChange("province", e.target.value)}
                className={inputClass(!!manualAddressErrors.province)}
              />
              {manualAddressErrors.province && (
                <p className="text-xs text-destructive">{manualAddressErrors.province}</p>
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
              onChange={(e) => onManualAddressChange("delivery_notes", e.target.value)}
            />
          </div>

          {addresses.length > 0 && (
            <button
              type="button"
              onClick={onUseSaved}
              className="text-xs text-maroon hover:underline"
            >
              ← Use a saved address instead
            </button>
          )}
        </div>
      )}
    </div>
  );
}
