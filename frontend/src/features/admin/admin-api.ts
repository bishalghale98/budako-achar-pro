import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import type {
  Product,
  ProductVariant,
  ProductImage,
  ProductReview,
  Category,
} from "../products/product-types";
import type {
  Order,
  OrderPayment,
  OrdersResponse,
  PaymentsResponse,
} from "../order/order-types";

interface AdminProductsResponse {
  success: boolean;
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface AdminProductResponse {
  success: boolean;
  product: Product;
}

interface AdminVariantsResponse {
  success: boolean;
  variants: ProductVariant[];
}

interface AdminImagesResponse {
  success: boolean;
  images: ProductImage[];
}

interface AdminReviewsResponse {
  success: boolean;
  reviews: ProductReview[];
}

interface AdminUsersResponse {
  success: boolean;
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
  }[];
}

interface MessageResponse {
  success: boolean;
  message: string;
}

interface AdminCategoriesResponse {
  success: boolean;
  categories: Category[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface AdminCategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["AdminProducts", "AdminVariants", "AdminImages", "AdminReviews", "AdminUsers", "AdminCategories", "AdminOrders", "AdminPayments"],
  endpoints: (builder) => ({
    // ─── Users ──────────────────────────────────────
    getAdminUsers: builder.query<AdminUsersResponse, void>({
      query: () => ({
        url: "/api/admin/users",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminUsers"],
    }),

    // ─── Products ───────────────────────────────────
    getAdminProducts: builder.query<
      AdminProductsResponse,
      {
        page?: number;
        per_page?: number;
        category_id?: string;
        status?: string;
        search?: string;
        featured?: boolean;
      }
    >({
      query: (params) => ({
        url: "/api/admin/products",
        params,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminProducts"],
    }),

    getAdminProduct: builder.query<AdminProductResponse, string>({
      query: (id) => ({
        url: `/api/admin/products/${id}`,
        headers: { Accept: "application/json" },
      }),
      providesTags: (_result, _error, id) => [
        { type: "AdminProducts", id },
      ],
    }),

    createAdminProduct: builder.mutation<
      AdminProductResponse,
      {
        category_id: string;
        title: string;
        slug: string;
        short_description?: string;
        description?: string;
        ingredients?: string;
        storage_info?: string;
        featured?: boolean;
        status?: string;
      }
    >({
      query: (body) => ({
        url: "/api/admin/products",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminProducts"],
    }),

    updateAdminProduct: builder.mutation<
      AdminProductResponse,
      {
        id: string;
        category_id?: string;
        title?: string;
        slug?: string;
        short_description?: string;
        description?: string;
        ingredients?: string;
        storage_info?: string;
        featured?: boolean;
        status?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/products/${id}`,
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AdminProducts",
        { type: "AdminProducts", id },
      ],
    }),

    deleteAdminProduct: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/api/admin/products/${id}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminProducts"],
    }),

    // ─── Variants ───────────────────────────────────
    getAdminVariants: builder.query<AdminVariantsResponse, string>({
      query: (productId) => ({
        url: `/api/admin/products/${productId}/variants`,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminVariants"],
    }),

    createAdminVariant: builder.mutation<
      { success: boolean; variant: ProductVariant },
      {
        productId: string;
        name: string;
        weight: number;
        unit: string;
        price: number;
        compare_price?: number;
        stock?: number;
        sku?: string;
        status?: string;
      }
    >({
      query: ({ productId, ...body }) => ({
        url: `/api/admin/products/${productId}/variants`,
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminVariants"],
    }),

    updateAdminVariant: builder.mutation<
      { success: boolean; variant: ProductVariant },
      {
        productId: string;
        variantId: string;
        name?: string;
        weight?: number;
        unit?: string;
        price?: number;
        compare_price?: number;
        stock?: number;
        sku?: string;
        status?: string;
      }
    >({
      query: ({ productId, variantId, ...body }) => ({
        url: `/api/admin/products/${productId}/variants/${variantId}`,
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminVariants"],
    }),

    deleteAdminVariant: builder.mutation<
      MessageResponse,
      { productId: string; variantId: string }
    >({
      query: ({ productId, variantId }) => ({
        url: `/api/admin/products/${productId}/variants/${variantId}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminVariants"],
    }),

    // ─── Images ─────────────────────────────────────
    getAdminImages: builder.query<AdminImagesResponse, string>({
      query: (productId) => ({
        url: `/api/admin/products/${productId}/images`,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminImages"],
    }),

    createAdminImage: builder.mutation<
      { success: boolean; image: ProductImage },
      { productId: string; formData: FormData }
    >({
      query: ({ productId, formData }) => ({
        url: `/api/admin/products/${productId}/images`,
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminImages"],
    }),

    updateAdminImage: builder.mutation<
      { success: boolean; image: ProductImage },
      {
        productId: string;
        imageId: string;
        image_url?: string;
        is_thumbnail?: boolean;
        sort_order?: number;
      }
    >({
      query: ({ productId, imageId, ...body }) => ({
        url: `/api/admin/products/${productId}/images/${imageId}`,
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminImages"],
    }),

    deleteAdminImage: builder.mutation<
      MessageResponse,
      { productId: string; imageId: string }
    >({
      query: ({ productId, imageId }) => ({
        url: `/api/admin/products/${productId}/images/${imageId}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminImages"],
    }),

    setAdminThumbnail: builder.mutation<
      MessageResponse,
      { productId: string; imageId: string }
    >({
      query: ({ productId, imageId }) => ({
        url: `/api/admin/products/${productId}/images/${imageId}/thumbnail`,
        method: "POST",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminImages"],
    }),

    // ─── Reviews ────────────────────────────────────
    getAdminReviews: builder.query<AdminReviewsResponse, string>({
      query: (productId) => ({
        url: `/api/admin/products/${productId}/reviews`,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminReviews"],
    }),

    approveAdminReview: builder.mutation<
      { success: boolean; review: ProductReview },
      { productId: string; reviewId: string }
    >({
      query: ({ productId, reviewId }) => ({
        url: `/api/admin/products/${productId}/reviews/${reviewId}/approve`,
        method: "POST",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminReviews"],
    }),

    rejectAdminReview: builder.mutation<
      { success: boolean; review: ProductReview },
      { productId: string; reviewId: string }
    >({
      query: ({ productId, reviewId }) => ({
        url: `/api/admin/products/${productId}/reviews/${reviewId}/reject`,
        method: "POST",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminReviews"],
    }),

    deleteAdminReview: builder.mutation<
      MessageResponse,
      { productId: string; reviewId: string }
    >({
      query: ({ productId, reviewId }) => ({
        url: `/api/admin/products/${productId}/reviews/${reviewId}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminReviews"],
    }),

    // ─── Categories ─────────────────────────────────
    getAdminCategories: builder.query<
      AdminCategoriesResponse,
      { page?: number; per_page?: number; search?: string }
    >({
      query: (params) => ({
        url: "/api/admin/categories",
        params,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminCategories"],
    }),

    createAdminCategory: builder.mutation<
      AdminCategoryResponse,
      { name: string }
    >({
      query: (body) => ({
        url: "/api/admin/categories",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminCategories"],
    }),

    updateAdminCategory: builder.mutation<
      AdminCategoryResponse,
      { id: string; name: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/categories/${id}`,
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminCategories"],
    }),

    deleteAdminCategory: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/api/admin/categories/${id}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["AdminCategories"],
    }),

    // ─── Orders ─────────────────────────────────────
    getAdminOrders: builder.query<
      OrdersResponse,
      { page?: number; per_page?: number; status?: string; search?: string }
    >({
      query: (params) => ({
        url: "/api/admin/orders",
        params,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminOrders"],
    }),

    getAdminOrder: builder.query<{ success: boolean; order: Order }, string>({
      query: (id) => ({
        url: `/api/admin/orders/${id}`,
        headers: { Accept: "application/json" },
      }),
      providesTags: (_result, _error, id) => [{ type: "AdminOrders", id }],
    }),

    updateOrderStatus: builder.mutation<
      { success: boolean; message: string; order: Order },
      { id: string; status: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/orders/${id}/status`,
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AdminOrders",
        { type: "AdminOrders", id },
      ],
    }),

    // ─── Payments ───────────────────────────────────
    getAdminPayments: builder.query<
      PaymentsResponse,
      { page?: number; per_page?: number; status?: string; method?: string }
    >({
      query: (params) => ({
        url: "/api/admin/payments",
        params,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["AdminPayments"],
    }),

    getAdminPayment: builder.query<
      { success: boolean; payment: OrderPayment },
      string
    >({
      query: (id) => ({
        url: `/api/admin/payments/${id}`,
        headers: { Accept: "application/json" },
      }),
      providesTags: (_result, _error, id) => [{ type: "AdminPayments", id }],
    }),

    verifyPayment: builder.mutation<
      { success: boolean; message: string; payment: OrderPayment },
      string
    >({
      query: (id) => ({
        url: `/api/admin/payments/${id}/verify`,
        method: "POST",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: (_result, _error, id) => [
        "AdminPayments",
        { type: "AdminPayments", id },
        "AdminOrders",
      ],
    }),

    rejectPayment: builder.mutation<
      { success: boolean; message: string; payment: OrderPayment },
      { id: string; reason: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/payments/${id}/reject`,
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AdminPayments",
        { type: "AdminPayments", id },
        "AdminOrders",
      ],
    }),

    getPaymentProof: builder.query<
      { success: boolean; url: string },
      string
    >({
      query: (id) => ({
        url: `/api/admin/payments/${id}/proof`,
        headers: { Accept: "application/json" },
      }),
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminProductsQuery,
  useGetAdminProductQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
  useGetAdminVariantsQuery,
  useCreateAdminVariantMutation,
  useUpdateAdminVariantMutation,
  useDeleteAdminVariantMutation,
  useGetAdminImagesQuery,
  useCreateAdminImageMutation,
  useUpdateAdminImageMutation,
  useDeleteAdminImageMutation,
  useSetAdminThumbnailMutation,
  useGetAdminReviewsQuery,
  useApproveAdminReviewMutation,
  useRejectAdminReviewMutation,
  useDeleteAdminReviewMutation,
  useGetAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderQuery,
  useUpdateOrderStatusMutation,
  useGetAdminPaymentsQuery,
  useGetAdminPaymentQuery,
  useVerifyPaymentMutation,
  useRejectPaymentMutation,
  useGetPaymentProofQuery,
} = adminApi;
