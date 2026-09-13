import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import type {
  AddressesResponse,
  AddressResponse,
  MessageResponse,
  AddressFormValues,
} from "./address-types";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["Addresses"],
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressesResponse, void>({
      query: () => ({
        url: "/api/addresses",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["Addresses"],
    }),
    createAddress: builder.mutation<AddressResponse, AddressFormValues>({
      query: (body) => ({
        url: "/api/addresses",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Addresses"],
    }),
    updateAddress: builder.mutation<
      AddressResponse,
      { id: string } & AddressFormValues
    >({
      query: ({ id, ...body }) => ({
        url: `/api/addresses/${id}`,
        method: "PUT",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Addresses"],
    }),
    deleteAddress: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/api/addresses/${id}`,
        method: "DELETE",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Addresses"],
    }),
    setDefaultAddress: builder.mutation<AddressResponse, string>({
      query: (id) => ({
        url: `/api/addresses/${id}/default`,
        method: "PUT",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;
