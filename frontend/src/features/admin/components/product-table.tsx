"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Plus, Pencil, Trash2, Package, Eye, Star } from "lucide-react";
import type { Product } from "@/features/products/product-types";

interface Props {
  products: Product[];
  isLoading: boolean;
  onDelete: (id: string, title: string) => void;
}

function getTotalStock(variants: { stock: number }[] | undefined) {
  return variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProductTable({ products, isLoading, onDelete }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</TableHead>
            <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="px-6 py-16 text-center">
                <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  No products yet
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Create your first product to get started.
                </p>
                <Button
                  onClick={() => router.push("/admin/products/new")}
                  className="bg-maroon text-white hover:bg-maroon-hover gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const totalStock = getTotalStock(product.variants);
              const thumbnail = product.images?.find((img) => img.is_thumbnail);

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {thumbnail ? (
                        <Image
                          src={thumbnail.image_url}
                          alt={product.title}
                          className="rounded-lg object-cover border border-slate-100"
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {product.title}
                        </p>
                        <p className="text-sm text-slate-500 truncate max-w-[280px]">
                          {product.short_description || "No description available"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="bg-maroon/10 text-maroon border-0 font-medium">
                      {product.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {totalStock > 0 ? (
                      <Badge
                        variant="secondary"
                        className={
                          totalStock <= 5
                            ? "bg-amber-50 text-amber-700 border-0"
                            : "bg-emerald-50 text-emerald-700 border-0"
                        }
                      >
                        {totalStock} in stock
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-50 text-red-600 border-0">
                        Out of stock
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-slate-700">
                        {product.rating > 0 ? product.rating.toFixed(1) : "\u2013"}
                      </span>
                      {product.review_count > 0 && (
                        <span className="text-xs text-slate-400">
                          ({product.review_count})
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        product.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-0"
                          : "bg-slate-100 text-slate-500 border-0"
                      }
                    >
                      {product.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-slate-500">
                      {formatDate(product.created_at)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                      >
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                      >
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onDelete(product.id, product.title)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
