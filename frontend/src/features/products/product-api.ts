import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import type {
  ProductsResponse,
  ProductResponse,
  ProductReviewsResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ProductReview,
} from "./product-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["Product", "Products", "Categories", "Reviews"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsResponse,
      {
        page?: number;
        per_page?: number;
        category_id?: string;
        featured?: boolean;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/api/products",
        params,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["Products"],
    }),

    getProductBySlug: builder.query<ProductResponse, string>({
      query: (slug) => ({
        url: `/api/products/${slug}`,
        headers: { Accept: "application/json" },
      }),
      providesTags: (_result, _error, slug) => [
        { type: "Product", id: slug },
      ],
    }),

    getProductReviews: builder.query<
      ProductReviewsResponse,
      { slug: string; page?: number }
    >({
      query: ({ slug, page }) => ({
        url: `/api/products/${slug}/reviews`,
        params: { page },
        headers: { Accept: "application/json" },
      }),
      providesTags: ["Reviews"],
    }),

    createReview: builder.mutation<
      { success: boolean; message: string; review: ProductReview },
      { productId: string } & CreateReviewRequest
    >({
      query: ({ productId, ...body }) => ({
        url: `/api/products/${productId}/reviews`,
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Reviews"],
    }),

    updateReview: builder.mutation<
      { success: boolean; message: string; review: ProductReview },
      { productId: string; reviewId: string } & UpdateReviewRequest
    >({
      query: ({ productId, reviewId, ...body }) => ({
        url: `/api/products/${productId}/reviews/${reviewId}`,
        method: "PATCH",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Reviews"],
    }),

    deleteReview: builder.mutation<
      { success: boolean; message: string },
      { productId: string; reviewId: string }
    >({
      query: ({ productId, reviewId }) => ({
        url: `/api/products/${productId}/reviews/${reviewId}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = productApi;
