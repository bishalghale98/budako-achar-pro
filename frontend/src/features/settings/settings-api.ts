import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import type {
  SiteSettingsResponse,
  PaymentSettingsResponse,
  OrderSettingsResponse,
} from "./settings-types";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["SiteSettings", "PaymentSettings", "OrderSettings"],
  endpoints: (builder) => ({
    // Site Settings
    getSiteSettings: builder.query<SiteSettingsResponse, void>({
      query: () => ({
        url: "/api/site-settings",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["SiteSettings"],
    }),

    getAdminSiteSettings: builder.query<SiteSettingsResponse, void>({
      query: () => ({
        url: "/api/admin/site-settings",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["SiteSettings"],
    }),

    updateSiteSettings: builder.mutation<
      SiteSettingsResponse,
      FormData
    >({
      query: (body) => ({
        url: "/api/admin/site-settings",
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["SiteSettings"],
    }),

    // Payment Settings
    getPaymentSettings: builder.query<PaymentSettingsResponse, void>({
      query: () => ({
        url: "/api/payment-settings",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["PaymentSettings"],
    }),

    getAdminPaymentSettings: builder.query<PaymentSettingsResponse, void>({
      query: () => ({
        url: "/api/admin/payment-settings",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["PaymentSettings"],
    }),

    updatePaymentSettings: builder.mutation<
      PaymentSettingsResponse,
      FormData
    >({
      query: (body) => ({
        url: "/api/admin/payment-settings",
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["PaymentSettings"],
    }),

    // Order Settings
    getAdminOrderSettings: builder.query<OrderSettingsResponse, void>({
      query: () => ({
        url: "/api/admin/order-settings",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["OrderSettings"],
    }),

    updateOrderSettings: builder.mutation<
      OrderSettingsResponse,
      { delivery_fee: number; free_delivery_threshold?: number | null; minimum_order_amount?: number | null }
    >({
      query: (body) => ({
        url: "/api/admin/order-settings",
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["OrderSettings"],
    }),
  }),
});

export const {
  useGetSiteSettingsQuery,
  useGetAdminSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  useGetPaymentSettingsQuery,
  useGetAdminPaymentSettingsQuery,
  useUpdatePaymentSettingsMutation,
  useGetAdminOrderSettingsQuery,
  useUpdateOrderSettingsMutation,
} = settingsApi;
