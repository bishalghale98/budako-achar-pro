"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/features/auth/auth-api";
import { getRoleHome } from "@/features/auth/components/role-guard";
import { safeRedirect } from "@/features/auth/auth-utils";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [login, { isLoading, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const fieldErrors = (error as { data?: { errors?: Record<string, string[]> } })?.data?.errors;
  const generalError = (error as { data?: { message?: string } })?.data?.message;

  useEffect(() => {
    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        setError(field as keyof LoginFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();
      const destination = safeRedirect(next, getRoleHome(res.user?.role));
      router.replace(destination);
    } catch {
      // Error handled by RTK Query
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-darkText">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm">
          Sign in to manage your orders and profile
        </p>
      </div>

      {/* Error */}
      {generalError && !fieldErrors && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {generalError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full px-4 py-3 border rounded-lg text-sm text-darkText focus:outline-none focus:border-maroon transition ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase text-gray-500">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-maroon hover:underline font-medium"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full px-4 py-3 border rounded-lg text-sm text-darkText focus:outline-none focus:border-maroon transition ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
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
            <p id="password-error" className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex py-2 items-center">
        <div className="grow border-t border-gray-200" />
        <span className="shrink mx-4 text-gray-400 text-xs uppercase tracking-wide">
          or
        </span>
        <div className="grow border-t border-gray-200" />
      </div>

      {/* Register */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-maroon font-bold hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
