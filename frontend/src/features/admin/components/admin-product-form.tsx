"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/auth-hooks";
import {
  useCreateAdminProductMutation,
  useCreateAdminVariantMutation,
  useCreateAdminImageMutation,
  useGetAdminCategoriesQuery,
} from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  Package,
  ArrowLeft,
  Upload,
  X,
  Star,
} from "lucide-react";
import {
  productSchema,
  type ProductFormValues,
} from "./admin-product-schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 10;

interface ImageEntry {
  file: File;
  preview: string;
  is_thumbnail: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File must be less than 5MB";
  }
  return null;
}

export default function AdminProductForm() {
  const router = useRouter();
  const user = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugManuallyEdited = useRef(false);

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);

  const { data: categoriesData } = useGetAdminCategoriesQuery({
    per_page: 100,
  });
  const categories = categoriesData?.categories ?? [];

  const [createProduct, { isLoading: isCreatingProduct }] =
    useCreateAdminProductMutation();
  const [createVariant] = useCreateAdminVariantMutation();
  const [createImage] = useCreateAdminImageMutation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: standardSchemaResolver(productSchema) as any,
    defaultValues: {
      title: "",
      category_id: "",
      slug: "",
      short_description: "",
      description: "",
      ingredients: "",
      storage_info: "",
      featured: false,
      status: "active",
      variants: [
        {
          name: "",
          weight: 0,
          unit: "g",
          price: 0,
          compare_price: null,
          stock: 0,
          sku: "",
          status: "active",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (!slugManuallyEdited.current) {
      setValue("slug", generateSlug(titleValue || ""));
    }
  }, [titleValue, setValue]);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newErrors: string[] = [];
      const remainingSlots = MAX_IMAGES - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      if (files.length > remainingSlots) {
        newErrors.push(
          `Maximum ${MAX_IMAGES} images allowed. Only ${remainingSlots} more can be added.`
        );
      }

      const newImages: ImageEntry[] = [];

      for (const file of filesToProcess) {
        const error = validateImage(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
          continue;
        }
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          is_thumbnail: images.length === 0 && newImages.length === 0,
        });
      }

      setImages((prev) => [...prev, ...newImages]);
      setImageErrors(newErrors);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [images.length]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      const next = prev.filter((_, i) => i !== index);
      if (removed.is_thumbnail && next.length > 0) {
        next[0] = { ...next[0], is_thumbnail: true };
      }
      return next;
    });
  }, []);

  const setThumbnail = useCallback((index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_thumbnail: i === index }))
    );
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      setImageErrors(["At least one image is required"]);
      return;
    }

    setImageErrors([]);

    try {
      const productResult = await createProduct({
        title: data.title,
        slug: data.slug,
        category_id: data.category_id,
        short_description: data.short_description || undefined,
        description: data.description || undefined,
        ingredients: data.ingredients || undefined,
        storage_info: data.storage_info || undefined,
        featured: data.featured,
        status: data.status,
      }).unwrap();

      const productId = productResult.product.id;

      for (const variant of data.variants) {
        await createVariant({
          productId,
          name: variant.name,
          weight: variant.weight,
          unit: variant.unit,
          price: variant.price,
          compare_price: variant.compare_price ?? undefined,
          stock: variant.stock,
          sku: variant.sku || undefined,
          status: variant.status,
        }).unwrap();
      }

      for (let i = 0; i < images.length; i++) {
        const body = new FormData();
        body.append("image", images[i].file);
        body.append("is_thumbnail", images[i].is_thumbnail ? "1" : "0");
        body.append("sort_order", i.toString());

        await createImage({ productId, formData: body }).unwrap();
      }

      router.push("/admin/products");
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError("root", {
        message: apiError?.data?.message || "Something went wrong",
      });
    }
  };

  const isSubmitting = isCreatingProduct;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-cream bg-cream/50 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon/10 text-maroon">
          <Package className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-xl font-bold text-maroon">
            Add New Product
          </h1>
          <p className="text-sm text-slate-600">
            Create a new product with variants and images for your store.
          </p>
        </div>
        {user && (
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-xs text-slate-500">Namaste,</p>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-xs font-bold text-maroon">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/products")}
            disabled={isSubmitting}
            className="gap-1.5 text-slate-600 hover:text-maroon"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={isSubmitting}
            className="border-slate-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            className="bg-maroon text-white hover:bg-maroon-hover shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {errors.root && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {errors.root.message}
          </AlertDescription>
        </Alert>
      )}

      <form
        id="product-form"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSubmit={handleSubmit(onSubmit as any)}
        className="space-y-8"
      >
        {/* Section 1: Basic Information */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="border-b border-slate-100 bg-gradient-to-r from-cream/30 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
                1
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  Basic Information
                </h2>
                <p className="text-xs text-slate-500">
                  Core product details and metadata
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-slate-700"
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g. Chicken Achar"
                  className="h-11 border-slate-200 focus:border-maroon focus:ring-maroon/20"
                />
                {errors.title && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="slug"
                  className="text-sm font-semibold text-slate-700"
                >
                  Slug *
                </Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="chicken-achar"
                  className="h-11 border-slate-200 font-mono text-sm focus:border-maroon focus:ring-maroon/20"
                  onChange={(e) => {
                    slugManuallyEdited.current = true;
                    register("slug").onChange(e);
                  }}
                />
                {errors.slug && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category_id"
                className="text-sm font-semibold text-slate-700"
              >
                Category *
              </Label>
              <select
                id="category_id"
                {...register("category_id")}
                className="flex h-11 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-maroon focus:ring-3 focus:ring-maroon/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs font-medium text-red-500">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="featured"
                  className="text-sm font-semibold text-slate-700"
                >
                  Featured
                </Label>
                <select
                  id="featured"
                  {...register("featured", {
                    setValueAs: (v) => v === "true",
                  })}
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-maroon focus:ring-3 focus:ring-maroon/20"
                >
                  <option value="false">No</option>
                  <option value="true">Yes - Show on homepage</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-semibold text-slate-700"
                >
                  Status
                </Label>
                <select
                  id="status"
                  {...register("status")}
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-maroon focus:ring-3 focus:ring-maroon/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="short_description"
                className="text-sm font-semibold text-slate-700"
              >
                Short Description
              </Label>
              <Input
                id="short_description"
                {...register("short_description")}
                placeholder="Brief description for product cards (max 500 characters)"
                className="h-11 border-slate-200 focus:border-maroon focus:ring-maroon/20"
              />
              {errors.short_description && (
                <p className="text-xs font-medium text-red-500">
                  {errors.short_description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Full product description, ingredients, recipe, and flavor story..."
                className="min-h-[120px] border-slate-200 focus:border-maroon focus:ring-maroon/20"
              />
              {errors.description && (
                <p className="text-xs font-medium text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="ingredients"
                  className="text-sm font-semibold text-slate-700"
                >
                  Ingredients
                </Label>
                <Textarea
                  id="ingredients"
                  {...register("ingredients")}
                  placeholder="e.g. Lapsi pulp, unrefined sugarcane jaggery, secret spice blends..."
                  className="min-h-[80px] border-slate-200 focus:border-maroon focus:ring-maroon/20"
                />
                {errors.ingredients && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.ingredients.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="storage_info"
                  className="text-sm font-semibold text-slate-700"
                >
                  Storage Information
                </Label>
                <Textarea
                  id="storage_info"
                  {...register("storage_info")}
                  placeholder="e.g. Store in a cool, dry place. Use a clean, dry spoon for serving. Keep tightly sealed."
                  className="min-h-[80px] border-slate-200 focus:border-maroon focus:ring-maroon/20"
                />
                {errors.storage_info && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.storage_info.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Variants */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="border-b border-slate-100 bg-gradient-to-r from-cream/30 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
                2
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  Weights & Pricing
                </h2>
                <p className="text-xs text-slate-500">
                  Define jar sizes, pricing, and inventory
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/20 text-xs font-bold text-maroon">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-700">
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
                  <Label className="text-xs font-semibold text-slate-600">
                    Variant Name *
                  </Label>
                  <Input
                    {...register(`variants.${index}.name`)}
                    placeholder="e.g. 250g Glass Jar"
                    className="h-10 border-slate-200 focus:border-maroon focus:ring-maroon/20"
                  />
                  {errors.variants?.[index]?.name && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.variants[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600">
                      Weight *
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.weight`, { valueAsNumber: true })}
                      placeholder="0"
                      className="h-10 border-slate-200 focus:border-maroon focus:ring-maroon/20"
                    />
                    {errors.variants?.[index]?.weight && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.variants[index]?.weight?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600">
                      Unit *
                    </Label>
                    <select
                      {...register(`variants.${index}.unit`)}
                      className="flex h-10 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-maroon focus:ring-3 focus:ring-maroon/20"
                    >
                      <option value="g">Grams (g)</option>
                      <option value="kg">Kilograms (kg)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600">
                      Price (NPR) *
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.price`, { valueAsNumber: true })}
                      placeholder="0"
                      className="h-10 border-slate-200 focus:border-maroon focus:ring-maroon/20"
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.variants[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600">
                      Compare Price
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.compare_price`, { valueAsNumber: true })}
                      placeholder="Optional"
                      className="h-10 border-slate-200 focus:border-maroon focus:ring-maroon/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600">
                      Stock
                    </Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                      placeholder="0"
                      className="h-10 border-slate-200 focus:border-maroon focus:ring-maroon/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600">
                      SKU
                    </Label>
                    <Input
                      {...register(`variants.${index}.sku`)}
                      placeholder="Optional"
                      className="h-10 border-slate-200 font-mono text-sm focus:border-maroon focus:ring-maroon/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600">
                      Status
                    </Label>
                    <select
                      {...register(`variants.${index}.status`)}
                      className="flex h-10 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-maroon focus:ring-3 focus:ring-maroon/20"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
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

        {/* Section 3: Product Images */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="border-b border-slate-100 bg-gradient-to-r from-cream/30 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
                3
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  Product Images
                </h2>
                <p className="text-xs text-slate-500">
                  Upload photos from your computer
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6">
            {imageErrors.length > 0 && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {imageErrors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                images.length >= MAX_IMAGES
                  ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-50"
                  : "border-maroon/20 bg-cream/20 hover:border-maroon/40 hover:bg-cream/40"
              }`}
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mb-1 text-sm font-semibold text-slate-700">
                Click to upload images
              </p>
              <p className="text-xs text-slate-500">
                JPEG, PNG, or WebP. Maximum 5MB per file.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {images.length} / {MAX_IMAGES} images selected
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img.preview}
                    className={`group relative overflow-hidden rounded-xl border-2 bg-white transition-all ${
                      img.is_thumbnail
                        ? "border-maroon shadow-md shadow-maroon/10"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="aspect-square relative bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.preview}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {img.is_thumbnail && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            Thumbnail
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="border-t border-slate-100 p-2.5">
                      <p className="truncate text-xs font-medium text-slate-600">
                        {img.file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatFileSize(img.file.size)}
                      </p>
                      {!img.is_thumbnail && (
                        <button
                          type="button"
                          onClick={() => setThumbnail(index)}
                          className="mt-1.5 text-xs font-semibold text-maroon hover:text-maroon-hover"
                        >
                          Set as Thumbnail
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={isSubmitting}
            className="border-slate-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-maroon text-white hover:bg-maroon-hover shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
