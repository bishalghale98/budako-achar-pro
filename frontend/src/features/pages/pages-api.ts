import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";

interface PublicPage {
  title: string;
  slug: string;
}

interface PublicPagesResponse {
  success: boolean;
  pages: PublicPage[];
}

export const pagesApi = createApi({
  reducerPath: "pagesApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["PublicPages"],
  endpoints: (builder) => ({
    getPublicPages: builder.query<PublicPagesResponse, void>({
      query: () => ({
        url: "/api/pages",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["PublicPages"],
    }),
  }),
});

export const { useGetPublicPagesQuery } = pagesApi;
