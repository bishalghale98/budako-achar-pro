"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useGetAdminPageQuery } from "@/features/admin/admin-api";
import AdminPageForm from "@/features/pages/components/admin-page-form";
import { PageFormSkeleton } from "./skeleton";

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetAdminPageQuery(id);

  if (isLoading) return <PageFormSkeleton />;

  if (isError || !data?.page) {
    notFound();
  }

  return <AdminPageForm initialData={data.page} />;
}
