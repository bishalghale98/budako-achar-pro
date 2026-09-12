"use client";

import { useEffect, useRef } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, ArrowLeft } from "lucide-react";
import { productSchema, type ProductFormValues } from "./admin-product-schema";
import { useProductImages } from "./use-product-images";
import { ProductBasicInfoSection } from "./product-basic-info-section";
import { ProductVariantsSection } from "./product-variants-section";
import { ProductImagesSection } from "./product-images-section";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminProductForm() {
  const router = useRouter();
  const user = useUser();
  const slugManuallyEdited = useRef(false);

  const { data: categoriesData } = useGetAdminCategoriesQuery({ per_page: 100 });
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

  const {
    images,
    imageErrors,
    fileInputRef,
    handleImageSelect,
    removeImage,
    setThumbnail,
    clearErrors,
  } = useProductImages();

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      setError("root", { message: "At least one image is required" });
      return;
    }

    clearErrors();

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
          <p className="text-sm text-muted-foreground">
            Create a new product with variants and images for your store.
          </p>
        </div>
        {user && (
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Namaste,</p>
              <p className="text-sm font-bold text-foreground">{user.name}</p>
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
          imageErrors={imageErrors}
          fileInputRef={fileInputRef}
          onImageSelect={handleImageSelect}
          onRemoveImage={removeImage}
          onSetThumbnail={setThumbnail}
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
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
