import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";

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
  tagTypes: ["CustomerDashboard"],
  endpoints: (builder) => ({
    getCustomerDashboard: builder.query<CustomerDashboardResponse, void>({
      query: () => ({
        url: "/api/customer/dashboard",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["CustomerDashboard"],
    }),
  }),
});

export const { useGetCustomerDashboardQuery } = customerApi;
