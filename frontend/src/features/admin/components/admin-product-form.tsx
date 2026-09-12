"use client";

import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/auth-hooks";
import {
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useCreateAdminVariantMutation,
  useUpdateAdminVariantMutation,
  useDeleteAdminVariantMutation,
  useCreateAdminImageMutation,
  useDeleteAdminImageMutation,
  useSetAdminThumbnailMutation,
  useGetAdminCategoriesQuery,
} from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, ArrowLeft } from "lucide-react";
import { productSchema, type ProductFormValues } from "./admin-product-schema";
import { useProductImages } from "./use-product-images";
import { ProductBasicInfoSection } from "./product-basic-info-section";
import { ProductVariantsSection } from "./product-variants-section";
import { ProductImagesSection } from "./product-images-section";
import type { Product, ProductVariant } from "@/features/products/product-types";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface AdminProductFormProps {
  initialData?: Product;
}

function hasVariantChanged(
  original: ProductVariant,
  submitted: ProductFormValues["variants"][0]
): boolean {
  return (
    original.name !== submitted.name ||
    original.weight !== submitted.weight ||
    original.unit !== submitted.unit ||
    original.price !== submitted.price ||
    original.compare_price !== (submitted.compare_price ?? null) ||
    original.stock !== submitted.stock ||
    (original.sku ?? "") !== submitted.sku ||
    original.status !== submitted.status
  );
}

export default function AdminProductForm({ initialData }: AdminProductFormProps) {
  const router = useRouter();
  const user = useUser();
  const slugManuallyEdited = useRef(false);
  const isEditing = !!initialData;

  const { data: categoriesData } = useGetAdminCategoriesQuery({ per_page: 100 });
  const categories = categoriesData?.categories ?? [];

  const [createProduct, { isLoading: isCreatingProduct }] =
    useCreateAdminProductMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] =
    useUpdateAdminProductMutation();
  const [createVariant] = useCreateAdminVariantMutation();
  const [updateVariant] = useUpdateAdminVariantMutation();
  const [deleteVariant] = useDeleteAdminVariantMutation();
  const [createImage] = useCreateAdminImageMutation();
  const [deleteImage] = useDeleteAdminImageMutation();
  const [setThumbnail] = useSetAdminThumbnailMutation();

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
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          category_id: initialData.category?.id ?? "",
          short_description: initialData.short_description ?? "",
          description: initialData.description ?? "",
          ingredients: initialData.ingredients ?? "",
          storage_info: initialData.storage_info ?? "",
          featured: initialData.featured,
          status: initialData.status,
          variants: (initialData.variants ?? []).map((v) => ({
            id: v.id,
            name: v.name,
            weight: v.weight,
            unit: v.unit,
            price: v.price,
            compare_price: v.compare_price,
            stock: v.stock,
            sku: v.sku ?? "",
            status: v.status,
          })),
        }
      : {
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
    if (!slugManuallyEdited.current && !isEditing) {
      setValue("slug", generateSlug(titleValue || ""));
    }
  }, [titleValue, setValue, isEditing]);

  const {
    images,
    existingImages,
    deletedImageIds,
    thumbnailImageId,
    imageErrors,
    fileInputRef,
    initExistingImages,
    handleImageSelect,
    removeImage,
    removeExistingImage,
    setThumbnail: setNewThumbnail,
    setExistingThumbnail,
    clearErrors,
  } = useProductImages();

  useEffect(() => {
    if (initialData?.images) {
      initExistingImages(initialData.images);
    }
  }, [initialData, initExistingImages]);

  const onSubmit = async (data: ProductFormValues) => {
    const activeExisting = existingImages.filter(
      (img) => !deletedImageIds.has(img.id)
    );
    const totalImages = activeExisting.length + images.length;

    if (totalImages === 0) {
      setError("root", { message: "At least one image is required" });
      return;
    }

    clearErrors();

    try {
      let productId: string;

      if (isEditing) {
        await updateProduct({
          id: initialData.id,
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
        productId = initialData.id;

        // Diff variants
        const submittedVariantIds = new Set(
          data.variants.filter((v) => v.id).map((v) => v.id)
        );

        // Delete removed variants
        for (const original of initialData.variants ?? []) {
          if (!submittedVariantIds.has(original.id)) {
            await deleteVariant({
              productId,
              variantId: original.id,
            }).unwrap();
          }
        }

        // Update existing or create new variants
        for (const variant of data.variants) {
          if (variant.id) {
            const original = (initialData.variants ?? []).find(
              (v) => v.id === variant.id
            );
            if (original && hasVariantChanged(original, variant)) {
              await updateVariant({
                productId,
                variantId: variant.id,
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
          } else {
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
        }

        // Delete removed images
        for (const imageId of deletedImageIds) {
          await deleteImage({ productId, imageId }).unwrap();
        }

        // Upload new images
        for (let i = 0; i < images.length; i++) {
          const body = new FormData();
          body.append("image", images[i].file);
          body.append("is_thumbnail", images[i].is_thumbnail ? "1" : "0");
          body.append(
            "sort_order",
            (activeExisting.length + i).toString()
          );
          await createImage({ productId, formData: body }).unwrap();
        }

        // Apply thumbnail change if needed
        if (thumbnailImageId) {
          await setThumbnail({
            productId,
            imageId: thumbnailImageId,
          }).unwrap();
        }
      } else {
        // Create mode
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

        productId = productResult.product.id;

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
      }

      router.push("/admin/products");
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError("root", {
        message: apiError?.data?.message || "Something went wrong",
      });
    }
  };

  const isSubmitting = isCreatingProduct || isUpdatingProduct;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-cream bg-cream/50 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon/10 text-maroon">
          <Package className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-xl font-bold text-maroon">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update product details, variants, and images."
              : "Create a new product with variants and images for your store."}
          </p>
        </div>
        {user && (
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Namaste,</p>
              <p className="text-sm font-bold text-foreground">{user.name}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-maroon/10 text-xs font-bold text-maroon">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
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
            className="gap-1.5 text-muted-foreground hover:text-primary"
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
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            className="bg-maroon text-white hover:bg-maroon-hover shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update Product"
                : "Save Product"}
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
        <ProductBasicInfoSection
          register={register}
          errors={errors}
          categories={categories}
          control={control}
        />

        <ProductVariantsSection
          register={register}
          errors={errors}
          fields={fields}
          append={append}
          remove={remove}
          control={control}
        />

        <ProductImagesSection
          images={images}
          existingImages={existingImages}
          deletedImageIds={deletedImageIds}
          imageErrors={imageErrors}
          fileInputRef={fileInputRef}
          onImageSelect={handleImageSelect}
          onRemoveImage={removeImage}
          onRemoveExistingImage={removeExistingImage}
          onSetThumbnail={setNewThumbnail}
          onSetExistingThumbnail={setExistingThumbnail}
        />

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-card px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={isSubmitting}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-maroon text-white hover:bg-maroon-hover shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update Product"
                : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
