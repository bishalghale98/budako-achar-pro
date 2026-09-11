"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPasswordMutation } from "@/features/auth/auth-api";
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { email: emailParam, password: "", password_confirmation: "" },
  });

  const fieldErrors = (error as { data?: { errors?: Record<string, string[]> } })?.data?.errors;
  const generalError = (error as { data?: { message?: string } })?.data?.message;

  useEffect(() => {
    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        setError(field as keyof ResetPasswordFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }, [fieldErrors, setError]);

  if (!token) {
    return (
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-darkText">
            Invalid Link
          </h1>
          <p className="text-gray-500 text-sm">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="block w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm text-center"
        >
          Request a New Reset Link
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const result = await resetPassword({ token, ...data }).unwrap();
      setSuccessMessage(result.message);
    } catch {
      // Error handled by RTK Query
    }
  };

  if (successMessage) {
    return (
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-darkText">
            Password Reset
          </h1>
          <p className="text-gray-500 text-sm">
            {successMessage} Please log in with your new password.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const inputClass = (field?: boolean) =>
    `w-full px-4 py-3 border rounded-lg text-sm text-darkText focus:outline-none focus:border-maroon transition ${
      field ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-darkText">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm">Enter your new password below.</p>
      </div>

      {generalError && !fieldErrors && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass(!!errors.password)}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-darkText transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className={inputClass(!!errors.password_confirmation)}
            {...register("password_confirmation")}
          />
          {errors.password_confirmation && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm disabled:opacity-60"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
