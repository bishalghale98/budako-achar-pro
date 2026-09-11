import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import type { CategoriesResponse } from "./product-types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/api/categories",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["Categories"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
