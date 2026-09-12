"use client";

import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFormValues } from "./admin-product-schema";
import type { Category } from "@/features/products/product-types";
import { useRef } from "react";

interface Props {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: Category[];
  control: Control<ProductFormValues>;
}

export function ProductBasicInfoSection({ register, errors, categories, control }: Props) {
  const slugManuallyEdited = useRef(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
            1
          </span>
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Basic Information
            </h2>
            <p className="text-xs text-muted-foreground">
              Core product details and metadata
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-foreground">
              Title *
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g. Chicken Achar"
              className="h-11 border-border focus:border-maroon focus:ring-maroon/20"
            />
            {errors.title && (
              <p className="text-xs font-medium text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-semibold text-foreground">
              Slug *
            </Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="chicken-achar"
              className="h-11 border-border font-mono text-sm focus:border-maroon focus:ring-maroon/20"
              onChange={(e) => {
                slugManuallyEdited.current = true;
                register("slug").onChange(e);
              }}
            />
            {errors.slug && (
              <p className="text-xs font-medium text-red-500">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id" className="text-sm font-semibold text-foreground">
            Category *
          </Label>
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => {
              const selectedCategory = categories.find((cat) => cat.id === field.value);
              return (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category_id" className="w-full">
                    <SelectValue placeholder={selectedCategory?.name ?? "Select a category"}>
                      {selectedCategory?.name ?? "Select a category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.category_id && (
            <p className="text-xs font-medium text-red-500">{errors.category_id.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="featured" className="text-sm font-semibold text-foreground">
              Featured
            </Label>
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(val) => field.onChange(val === "true")}
                >
                  <SelectTrigger id="featured" className="w-full">
                    <SelectValue>
                      {field.value ? "Yes - Show on homepage" : "No"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes - Show on homepage</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold text-foreground">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className="w-full">
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

        <div className="space-y-2">
          <Label htmlFor="short_description" className="text-sm font-semibold text-foreground">
            Short Description
          </Label>
          <Input
            id="short_description"
            {...register("short_description")}
            placeholder="Brief description for product cards (max 500 characters)"
            className="h-11 border-border focus:border-maroon focus:ring-maroon/20"
          />
          {errors.short_description && (
            <p className="text-xs font-medium text-red-500">{errors.short_description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Full product description, ingredients, recipe, and flavor story..."
            className="min-h-[120px] border-border focus:border-maroon focus:ring-maroon/20"
          />
          {errors.description && (
            <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ingredients" className="text-sm font-semibold text-foreground">
              Ingredients
            </Label>
            <Textarea
              id="ingredients"
              {...register("ingredients")}
              placeholder="e.g. Lapsi pulp, unrefined sugarcane jaggery, secret spice blends..."
              className="min-h-[80px] border-border focus:border-maroon focus:ring-maroon/20"
            />
            {errors.ingredients && (
              <p className="text-xs font-medium text-red-500">{errors.ingredients.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage_info" className="text-sm font-semibold text-foreground">
              Storage Information
            </Label>
            <Textarea
              id="storage_info"
              {...register("storage_info")}
              placeholder="e.g. Store in a cool, dry place. Use a clean, dry spoon for serving. Keep tightly sealed."
              className="min-h-[80px] border-border focus:border-maroon focus:ring-maroon/20"
            />
            {errors.storage_info && (
              <p className="text-xs font-medium text-red-500">{errors.storage_info.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
