import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import type { Order, OrdersResponse, MessageResponse } from "../order/order-types";

export interface CustomerDashboardStats {
  total_orders: number;
  active_orders: number;
  delivered_orders: number;
  total_spent: string;
}

export interface CustomerDashboardOrder {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export interface CustomerDashboardResponse {
  success: boolean;
  stats: CustomerDashboardStats;
  recent_orders: CustomerDashboardOrder[];
}

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["CustomerDashboard", "CustomerOrders"],
  endpoints: (builder) => ({
    getCustomerDashboard: builder.query<CustomerDashboardResponse, void>({
      query: () => ({
        url: "/api/customer/dashboard",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["CustomerDashboard"],
    }),

    getCustomerOrders: builder.query<
      OrdersResponse,
      { page?: number; per_page?: number }
    >({
      query: (params) => ({
        url: "/api/customer/orders",
        params,
        headers: { Accept: "application/json" },
      }),
      providesTags: ["CustomerOrders"],
    }),

    getCustomerOrder: builder.query<
      { success: boolean; order: Order },
      string
    >({
      query: (id) => ({
        url: `/api/customer/orders/${id}`,
        headers: { Accept: "application/json" },
      }),
      providesTags: (_result, _error, id) => [
        { type: "CustomerOrders", id },
      ],
    }),

    cancelOrder: builder.mutation<
      MessageResponse,
      { id: string; reason: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/customer/orders/${id}/cancel`,
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "CustomerOrders",
        "CustomerDashboard",
        { type: "CustomerOrders", id },
      ],
    }),
  }),
});

export const {
  useGetCustomerDashboardQuery,
  useGetCustomerOrdersQuery,
  useGetCustomerOrderQuery,
  useCancelOrderMutation,
} = customerApi;
