"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
} from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/shared";
import { Plus, Pencil, Trash2, FolderOpen, Search } from "lucide-react";
import { categorySchema, type CategoryFormValues } from "./category-schema";

export default function CategoryContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");

  const { data, isLoading } = useGetAdminCategoriesQuery({ page, per_page: 15, search });
  const [createCategory, { isLoading: isCreating }] = useCreateAdminCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateAdminCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteAdminCategoryMutation();

  const categories = data?.categories ?? [];
  const pagination = data?.pagination;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const openCreate = () => {
    setEditingId(null);
    reset({ name: "" });
    setOpen(true);
  };

  const openEdit = (id: string, currentName: string) => {
    setEditingId(id);
    reset({ name: currentName });
    setOpen(true);
  };

  const openDeleteDialog = (id: string, categoryName: string) => {
    setDeletingId(id);
    setDeletingName(categoryName);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (editingId) {
        await updateCategory({ id: editingId, name: data.name }).unwrap();
      } else {
        await createCategory({ name: data.name }).unwrap();
      }
      setOpen(false);
      reset();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError("root", { message: apiError?.data?.message || "Something went wrong" });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteCategory(deletingId).unwrap();
      setDeleteDialogOpen(false);
      setDeletingId(null);
      setDeletingName("");
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      alert(apiError?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <Button onClick={openCreate} className="bg-maroon text-white hover:bg-maroon-hover gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-10 pl-9"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Slug
              </th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Products
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">No categories yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first category to get started.</p>
                  <Button onClick={openCreate} className="bg-maroon text-white hover:bg-maroon-hover gap-2">
                    <Plus className="h-4 w-4" />
                    New Category
                  </Button>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{category.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{category.slug}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full bg-maroon/10 px-2.5 py-0.5 text-xs font-bold text-maroon">
                      {category.products_count ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(category.id, category.name)}
                        className="gap-1.5"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(category.id, category.name)}
                        className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pagination.last_page}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-medium text-foreground">
                Category Name
              </Label>
              <Input
                id="category-name"
                {...register("name")}
                placeholder="e.g. Non-Veg Achar"
                className="h-10"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-maroon text-white hover:bg-maroon-hover"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
