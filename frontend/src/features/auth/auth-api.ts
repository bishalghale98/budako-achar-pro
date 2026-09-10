import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "@/lib/api/base-query";
import { tagTypes } from "@/lib/api/api-tags";
import { setCredentials, logout as logoutAction } from "./auth-slice";
import type { User, AuthResponse, MeResponse, MessageResponse } from "./auth-types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes,
  endpoints: (builder) => ({
    register: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string; password_confirmation: string }
    >({
      query: (body) => ({
        url: "/api/register",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
    }),
    login: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/api/login",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setCredentials({ user: data.user }));
          }
        } catch {
          // Handled by caller
        }
      },
    }),
    me: builder.query<MeResponse, void>({
      query: () => ({
        url: "/api/me",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/api/logout",
        method: "POST",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Proceed with client logout even if backend fails
        } finally {
          dispatch(logoutAction());
        }
      },
    }),
    logoutAll: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/api/logout-all",
        method: "POST",
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Proceed with client logout even if backend fails
        } finally {
          dispatch(logoutAction());
        }
      },
    }),
    forgotPassword: builder.mutation<
      MessageResponse,
      { email: string }
    >({
      query: (body) => ({
        url: "/api/forgot-password",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
    }),
    resetPassword: builder.mutation<
      MessageResponse,
      { token: string; email: string; password: string; password_confirmation: string }
    >({
      query: (body) => ({
        url: "/api/reset-password",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
    }),
    changePassword: builder.mutation<
      MessageResponse,
      { current_password: string; password: string; password_confirmation: string }
    >({
      query: (body) => ({
        url: "/api/change-password",
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      }),
    }),
    getProfile: builder.query<MeResponse, void>({
      query: () => ({
        url: "/api/user/profile",
        headers: { Accept: "application/json" },
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<
      { success: boolean; message: string; user: User },
      { name: string; email: string }
    >({
      query: (body) => ({
        url: "/api/user/profile",
        method: "PATCH",
        body,
        headers: { Accept: "application/json" },
      }),
      invalidatesTags: ["User"],
    }),
    sendVerificationEmail: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/api/email/verification-notification",
        method: "POST",
        headers: { Accept: "application/json" },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useLogoutMutation,
  useLogoutAllMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSendVerificationEmailMutation,
} = authApi;
