"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Page } from "@/features/pages/page-types";

interface Props {
  pages: Page[];
  isLoading: boolean;
  onDelete: (id: string, title: string) => void;
}

export function PageTable({ pages, isLoading, onDelete }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Slug
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Created
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Updated
            </TableHead>
            <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : pages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="px-6 py-16 text-center">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  No pages yet
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Create your first page to get started.
                </p>
                <Button
                  onClick={() => router.push("/admin/pages/new")}
                  className="bg-maroon text-white hover:bg-maroon-hover gap-2"
                >
                  Add Page
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <p className="font-semibold text-slate-900 truncate max-w-[280px]">
                    {page.title}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-500 truncate max-w-[200px] block">
                    /{page.slug}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      page.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-0"
                        : "bg-slate-100 text-slate-500 border-0"
                    }
                  >
                    {page.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-500">
                    {formatDate(page.created_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-500">
                    {formatDate(page.updated_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        router.push(`/admin/pages/${page.id}/edit`)
                      }
                    >
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onDelete(page.id, page.title)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
