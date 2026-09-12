"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAdminProductsQuery,
  useDeleteAdminProductMutation,
} from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/shared";
import { Plus, Search } from "lucide-react";
import { ProductTable } from "./product-table";

export default function AdminProductContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");

  const { data, isLoading } = useGetAdminProductsQuery({
    page,
    per_page: 15,
    search,
  });

  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteAdminProductMutation();

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const lastPage = data?.last_page ?? 1;

  const openDeleteDialog = (id: string, title: string) => {
    setDeletingId(id);
    setDeletingName(title);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProduct(deletingId).unwrap();
      setDeleteDialogOpen(false);
      setDeletingId(null);
      setDeletingName("");
    } catch {
      // handled by RTK Query
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your artisanal batches and inventory.
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/products/new")}
          className="bg-maroon text-white hover:bg-maroon-hover gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-10 pl-9"
        />
      </div>

      {/* Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        onDelete={openDeleteDialog}
      />

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {products.length} of {total} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500">
              Page {page} of {lastPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === lastPage}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingName}"? This will permanently remove the product, all its variants, images, and reviews. This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
