import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "@/features/auth/auth-slice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getXsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

let csrfFetched = false;

async function fetchCsrfCookie() {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
  csrfFetched = true;
}

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getXsrfToken();
    if (token) {
      headers.set("X-XSRF-TOKEN", token);
    }
    return headers;
  },
});

export const baseQueryWithCsrf: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const isMutating =
    typeof args === "object" &&
    args.method &&
    ["POST", "PUT", "DELETE", "PATCH"].includes(args.method.toUpperCase());

  if (isMutating && !getXsrfToken() && !csrfFetched) {
    await fetchCsrfCookie();
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 419) {
    await fetchCsrfCookie();
    result = await baseQuery(args, api, extraOptions);
  }

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};
