"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useGetAdminProductQuery } from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Pencil, Package, Star, ExternalLink } from "lucide-react";

function getTotalStock(variants: { stock: number }[] | undefined) {
  return variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
}

function formatPrice(price: number) {
  return `NPR ${price.toLocaleString()}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-28" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useGetAdminProductQuery(id);

  if (isLoading) return <ViewSkeleton />;

  if (isError || !data?.product) {
    notFound();
  }

  const product = data.product;
  const totalStock = getTotalStock(product.variants);
  const thumbnail = product.images?.find((img) => img.is_thumbnail);
  const sortedImages = [...(product.images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/products")}
            className="gap-1.5 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {product.title}
            </h1>
            <p className="text-sm text-slate-500">
              /{product.slug}
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/products/edit/${product.id}`)}
          className="bg-maroon text-white hover:bg-maroon-hover gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Basic Information
              </h2>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-maroon/10 text-maroon border-0 font-medium"
                  >
                    {product.category?.name || "Uncategorized"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </p>
                  <Badge
                    variant="secondary"
                    className={
                      product.status === "active"
                        ? "mt-1 bg-emerald-50 text-emerald-700 border-0"
                        : "mt-1 bg-slate-100 text-slate-500 border-0"
                    }
                  >
                    {product.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Featured
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {product.featured ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rating
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">
                      {product.rating > 0 ? product.rating.toFixed(1) : "–"}
                    </span>
                    {product.review_count > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({product.review_count} reviews)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {product.short_description && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Short Description
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {product.short_description}
                  </p>
                </div>
              )}

              {product.description && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </p>
                  <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {product.ingredients && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ingredients
                  </p>
                  <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {product.storage_info && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Storage Information
                  </p>
                  <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                    {product.storage_info}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Weights & Pricing
              </h2>
            </div>
            <div className="p-6">
              {product.variants && product.variants.length > 0 ? (
                <div className="space-y-3">
                  {product.variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/50 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/20 text-xs font-bold text-maroon">
                            {index + 1}
                          </span>
                          <h3 className="text-sm font-bold text-foreground">
                            {variant.name}
                          </h3>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            variant.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-0"
                              : "bg-slate-100 text-slate-500 border-0"
                          }
                        >
                          {variant.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Weight
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {variant.weight}
                            {variant.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Price
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {formatPrice(variant.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Compare
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {variant.compare_price
                              ? formatPrice(variant.compare_price)
                              : "–"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Stock
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              variant.stock <= 5
                                ? "text-amber-600"
                                : "text-foreground"
                            }`}
                          >
                            {variant.stock}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            SKU
                          </p>
                          <p className="text-sm font-mono text-muted-foreground">
                            {variant.sku || "–"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No variants defined.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Images */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Images
              </h2>
            </div>
            <div className="p-6">
              {sortedImages.length > 0 ? (
                <div className="space-y-3">
                  {sortedImages.map((img) => (
                    <div
                      key={img.id}
                      className={`relative overflow-hidden rounded-xl border-2 ${
                        img.is_thumbnail
                          ? "border-maroon shadow-md shadow-maroon/10"
                          : "border-border"
                      }`}
                    >
                      <div className="aspect-square relative bg-muted">
                        <Image
                          src={img.image_url}
                          alt={product.title}
                          className="h-full w-full object-cover"
                          fill
                          sizes="300px"
                        />
                        {img.is_thumbnail && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              Thumbnail
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No images uploaded
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Summary
              </h2>
            </div>
            <div className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Stock
                </span>
                <span
                  className={`text-sm font-bold ${
                    totalStock <= 5 ? "text-amber-600" : "text-foreground"
                  }`}
                >
                  {totalStock} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Variants
                </span>
                <span className="text-sm font-bold text-foreground">
                  {product.variants?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Images</span>
                <span className="text-sm font-bold text-foreground">
                  {product.images?.length ?? 0}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm text-foreground">
                    {formatDate(product.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Updated
                </span>
                <span className="text-sm text-foreground">
                  {formatDate(product.updated_at)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <a
                  href={`/products/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:text-maroon-hover"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
