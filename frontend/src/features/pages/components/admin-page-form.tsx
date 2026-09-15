"use client";

import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import {
  useCreateAdminPageMutation,
  useUpdateAdminPageMutation,
  useCreateAdminPageImageMutation,
} from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, FileText } from "lucide-react";
import { TiptapEditor } from "@/components/shared/tiptap";
import { pageSchema, type PageFormValues } from "../page-schema";
import type { Page } from "../page-types";
import type { TiptapDoc } from "@/components/shared/tiptap";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface AdminPageFormProps {
  initialData?: Page;
}

export default function AdminPageForm({ initialData }: AdminPageFormProps) {
  const router = useRouter();
  const slugManuallyEdited = useRef(false);
  const isEditing = !!initialData;

  const [createPage, { isLoading: isCreating }] =
    useCreateAdminPageMutation();
  const [updatePage, { isLoading: isUpdating }] =
    useUpdateAdminPageMutation();
  const [uploadPageImage] = useCreateAdminPageImageMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<PageFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: standardSchemaResolver(pageSchema) as any,
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          short_description: initialData.short_description ?? "",
          content: initialData.content ?? undefined,
          status: initialData.status,
          seo_title: initialData.seo_title ?? "",
          seo_description: initialData.seo_description ?? "",
          canonical_url: initialData.canonical_url ?? "",
        }
      : {
          title: "",
          slug: "",
          short_description: "",
          content: undefined,
          status: "draft",
          seo_title: "",
          seo_description: "",
          canonical_url: "",
        },
  });

  const titleValue = watch("title");
  const contentValue = watch("content");

  useEffect(() => {
    if (!slugManuallyEdited.current && !isEditing) {
      setValue("slug", generateSlug(titleValue || ""));
    }
  }, [titleValue, setValue, isEditing]);

  const handleContentChange = (json: TiptapDoc) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("content", json as any, { shouldValidate: false });
  };

  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      if (!initialData?.id) {
        throw new Error("Save the page before adding images.");
      }
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadPageImage({
        pageId: initialData.id,
        formData,
      }).unwrap();
      return result.image_url;
    },
    [initialData?.id, uploadPageImage]
  );

  const onSubmit = async (data: PageFormValues) => {
    try {
      if (isEditing) {
        await updatePage({
          id: initialData.id,
          title: data.title,
          slug: data.slug,
          short_description: data.short_description || undefined,
          content: data.content as TiptapDoc | undefined,
          status: data.status,
          seo_title: data.seo_title || undefined,
          seo_description: data.seo_description || undefined,
          canonical_url: data.canonical_url || undefined,
        }).unwrap();
      } else {
        await createPage({
          title: data.title,
          slug: data.slug,
          short_description: data.short_description || undefined,
          content: data.content as TiptapDoc | undefined,
          status: data.status,
          seo_title: data.seo_title || undefined,
          seo_description: data.seo_description || undefined,
          canonical_url: data.canonical_url || undefined,
        }).unwrap();
      }

      router.push("/admin/pages");
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError("root", {
        message: apiError?.data?.message || "Something went wrong",
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-cream bg-cream/50 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon/10 text-maroon">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-xl font-bold text-maroon">
            {isEditing ? "Edit Page" : "Add New Page"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update page content and settings."
              : "Create a new page for your website."}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/pages")}
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
            onClick={() => router.push("/admin/pages")}
            disabled={isSubmitting}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="page-form"
            className="bg-maroon text-white hover:bg-maroon-hover shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update Page"
                : "Save Page"}
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
        id="page-form"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSubmit={handleSubmit(onSubmit as any)}
        className="space-y-8"
      >
        {/* Basic Information */}
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
                  Page title, slug, and description
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-foreground"
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g. About Us"
                  className="h-11 border-border focus:border-maroon focus:ring-maroon/20"
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
                  className="text-sm font-semibold text-foreground"
                >
                  Slug *
                </Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="about-us"
                  className="h-11 border-border font-mono text-sm focus:border-maroon focus:ring-maroon/20"
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
                htmlFor="short_description"
                className="text-sm font-semibold text-foreground"
              >
                Short Description
              </Label>
              <Input
                id="short_description"
                {...register("short_description")}
                placeholder="Brief description for meta tags and page previews (max 500 characters)"
                className="h-11 border-border focus:border-maroon focus:ring-maroon/20"
              />
              {errors.short_description && (
                <p className="text-xs font-medium text-red-500">
                  {errors.short_description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Status
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(val) =>
                  setValue("status", val as "draft" | "published")
                }
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue>
                    {watch("status") === "published" ? "Published" : "Draft"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
                2
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Content
                </h2>
                <p className="text-xs text-muted-foreground">
                  Rich text content for the page
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <TiptapEditor
              content={contentValue as TiptapDoc | null}
              onChange={handleContentChange}
              onImageUpload={isEditing ? handleImageUpload : undefined}
              placeholder="Start writing your page content..."
              className="min-h-[300px]"
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
                3
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  SEO Settings
                </h2>
                <p className="text-xs text-muted-foreground">
                  Search engine optimization metadata
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="space-y-2">
              <Label
                htmlFor="seo_title"
                className="text-sm font-semibold text-foreground"
              >
                SEO Title
              </Label>
              <Input
                id="seo_title"
                {...register("seo_title")}
                placeholder="Override the default page title for search engines"
                className="h-11 border-border focus:border-maroon focus:ring-maroon/20"
              />
              {errors.seo_title && (
                <p className="text-xs font-medium text-red-500">
                  {errors.seo_title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="seo_description"
                className="text-sm font-semibold text-foreground"
              >
                SEO Description
              </Label>
              <Textarea
                id="seo_description"
                {...register("seo_description")}
                placeholder="Meta description for search engine results"
                className="min-h-[80px] border-border focus:border-maroon focus:ring-maroon/20"
              />
              {errors.seo_description && (
                <p className="text-xs font-medium text-red-500">
                  {errors.seo_description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="canonical_url"
                className="text-sm font-semibold text-foreground"
              >
                Canonical URL
              </Label>
              <Input
                id="canonical_url"
                {...register("canonical_url")}
                placeholder="https://example.com/about"
                className="h-11 border-border focus:border-maroon focus:ring-maroon/20"
              />
              {errors.canonical_url && (
                <p className="text-xs font-medium text-red-500">
                  {errors.canonical_url.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-card px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/pages")}
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
                ? "Update Page"
                : "Save Page"}
          </Button>
        </div>
      </form>
    </div>
  );
}
