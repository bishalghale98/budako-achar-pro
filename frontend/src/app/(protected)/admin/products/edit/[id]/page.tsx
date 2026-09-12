"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useGetAdminProductQuery } from "@/features/admin/admin-api";
import AdminProductForm from "@/features/admin/components/admin-product-form";
import { ProductFormSkeleton } from "./skeleton";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetAdminProductQuery(id);

  if (isLoading) return <ProductFormSkeleton />;

  if (isError || !data?.product) {
    notFound();
  }

  return <AdminProductForm initialData={data.product} />;
}
