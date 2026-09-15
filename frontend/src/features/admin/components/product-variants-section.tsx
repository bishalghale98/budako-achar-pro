"use client";

import type { UseFormRegister, FieldErrors, UseFieldArrayReturn, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { ProductFormValues } from "./admin-product-schema";

interface Props {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  fields: UseFieldArrayReturn<ProductFormValues, "variants">["fields"];
  append: UseFieldArrayReturn<ProductFormValues, "variants">["append"];
  remove: UseFieldArrayReturn<ProductFormValues, "variants">["remove"];
  control: Control<ProductFormValues>;
}

export function ProductVariantsSection({ register, errors, fields, append, remove, control }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
            2
          </span>
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Weights & Pricing
            </h2>
            <p className="text-xs text-muted-foreground">
              Define jar sizes, pricing, and inventory
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/50 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/20 text-xs font-bold text-maroon">
                  {index + 1}
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  Variant {index + 1}
                </h3>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Variant Name *
              </Label>
              <Input
                {...register(`variants.${index}.name`)}
                placeholder="e.g. 250g Glass Jar"
                className="h-10 border-border focus:border-maroon focus:ring-maroon/20"
              />
              {errors.variants?.[index]?.name && (
                <p className="text-xs font-medium text-red-500">
                  {errors.variants[index]?.name?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Weight *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`variants.${index}.weight`, { valueAsNumber: true })}
                  placeholder="0"
                  className="h-10 border-border focus:border-maroon focus:ring-maroon/20"
                />
                {errors.variants?.[index]?.weight && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.variants[index]?.weight?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Unit *</Label>
                <Controller
                  name={`variants.${index}.unit`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {field.value === "kg" ? "Kilograms (kg)" : "Grams (g)"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Price (NPR) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`variants.${index}.price`, { valueAsNumber: true })}
                  placeholder="0"
                  className="h-10 border-border focus:border-maroon focus:ring-maroon/20"
                />
                {errors.variants?.[index]?.price && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.variants[index]?.price?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Compare Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`variants.${index}.compare_price`, { valueAsNumber: true })}
                  placeholder="Optional"
                  className="h-10 border-border focus:border-maroon focus:ring-maroon/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Stock</Label>
                <Input
                  type="number"
                  {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                  placeholder="0"
                  className="h-10 border-border focus:border-maroon focus:ring-maroon/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">SKU</Label>
                <Input
                  {...register(`variants.${index}.sku`)}
                  placeholder="Optional"
                  className="h-10 border-border font-mono text-sm focus:border-maroon focus:ring-maroon/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
                <Controller
                  name={`variants.${index}.status`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {field.value === "active" ? "Active" : "Inactive"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              weight: 0,
              unit: "g",
              price: 0,
              compare_price: null,
              stock: 0,
              sku: "",
              status: "active",
            })
          }
          className="w-full sm:w-auto gap-2 border-dashed border-maroon/30 text-maroon hover:bg-maroon/5 hover:border-maroon/50"
        >
          <Plus className="h-4 w-4" />
          Add Another Size
        </Button>
      </div>
    </div>
  );
}
