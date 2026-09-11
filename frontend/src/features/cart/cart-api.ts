import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import type {
  CartResponse,
  AddCartItemRequest,
  UpdateCartItemRequest,
} from "./cart-types";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/api/cart",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["Cart"],
    }),

    addCartItem: builder.mutation<CartResponse, AddCartItemRequest>({
      query: (body) => ({
        url: "/api/cart/items",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      CartResponse,
      { cartItem: string } & UpdateCartItemRequest
    >({
      query: ({ cartItem, ...body }) => ({
        url: `/api/cart/items/${cartItem}`,
        method: "PATCH",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<CartResponse, string>({
      query: (cartItem) => ({
        url: `/api/cart/items/${cartItem}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/cart",
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
