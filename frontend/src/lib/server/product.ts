import { serverFetch } from "./api";
import type {
  ProductsResponse,
  ProductResponse,
  ProductReviewsResponse,
  CategoriesResponse,
} from "@/features/products/product-types";

export async function getProducts(params?: {
  page?: number;
  per_page?: number;
  category_id?: string;
  featured?: boolean;
  search?: string;
}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.category_id) searchParams.set("category_id", params.category_id);
  if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return serverFetch<ProductsResponse>(`/api/products${query ? `?${query}` : ""}`);
}

export async function getProductBySlug(slug: string): Promise<ProductResponse> {
  return serverFetch<ProductResponse>(`/api/products/${slug}`);
}

export async function getProductReviews(
  slug: string,
  page?: number
): Promise<ProductReviewsResponse> {
  const query = page ? `?page=${page}` : "";
  return serverFetch<ProductReviewsResponse>(`/api/products/${slug}/reviews${query}`);
}

export async function getCategories(): Promise<CategoriesResponse> {
  return serverFetch<CategoriesResponse>("/api/categories");
}
