import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import { cartApi } from "@/features/cart/cart-api";
import type { OrderResponse } from "./order-types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    placeOrder: builder.mutation<OrderResponse, FormData>({
      query: (body) => ({
        url: "/api/orders",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        } catch {
          // order failed, don't invalidate cart
        }
      },
    }),
  }),
});

export const { usePlaceOrderMutation } = orderApi;
