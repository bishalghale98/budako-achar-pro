"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAdminPagesQuery,
  useDeleteAdminPageMutation,
} from "@/features/admin/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/shared";
import { Plus, Search } from "lucide-react";
import { PageTable } from "./page-table";

export default function AdminPageContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");

  const { data, isLoading } = useGetAdminPagesQuery({
    page,
    per_page: 15,
    search,
  });

  const [deletePage, { isLoading: isDeleting }] =
    useDeleteAdminPageMutation();

  const pages = data?.pages ?? [];
  const pagination = data?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const total = pagination?.total ?? 0;

  const openDeleteDialog = (id: string, title: string) => {
    setDeletingId(id);
    setDeletingName(title);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deletePage(deletingId).unwrap();
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
            Pages
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your website pages and content.
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/pages/new")}
          className="bg-maroon text-white hover:bg-maroon-hover gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Page
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search pages..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-10 pl-9"
        />
      </div>

      {/* Table */}
      <PageTable pages={pages} isLoading={isLoading} onDelete={openDeleteDialog} />

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {pages.length} of {total} pages
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
        title="Delete Page"
        description={`Are you sure you want to delete "${deletingName}"? This will permanently remove the page. This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
