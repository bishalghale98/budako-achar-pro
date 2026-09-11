import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
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
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { usePlaceOrderMutation } = orderApi;
