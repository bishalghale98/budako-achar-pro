import { serverFetch } from "./api";
import type {
  ProductsResponse,
  ProductResponse,
  ProductReviewsResponse,
  CategoriesResponse,
  Category,
} from "@/features/products/product-types";

export async function getProducts(params?: {
  page?: number;
  per_page?: number;
  category_id?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.category_id) searchParams.set("category_id", params.category_id);
  if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.sort) searchParams.set("sort", params.sort);

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

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const { category } = await serverFetch<{ success: boolean; category: Category }>(`/api/categories/${slug}`);
    return category;
  } catch {
    return undefined;
  }
}

export async function getProductByCategorySlug(
  slug: string,
  params?: { page?: number; per_page?: number; sort?: string }
): Promise<{ category: Category; products: ProductsResponse } | null> {
  const category = await getCategoryBySlug(slug);
  if (!category) return null;

  const products = await getProducts({
    page: params?.page,
    per_page: params?.per_page ?? 12,
    category_id: category.id,
    sort: params?.sort,
  });

  return { category, products };
}
