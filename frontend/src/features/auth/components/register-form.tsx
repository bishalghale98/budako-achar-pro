"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "@/features/auth/auth-api";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
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

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", password_confirmation: "" },
  });

  const fieldErrors = (error as { data?: { errors?: Record<string, string[]> } })?.data?.errors;
  const generalError = (error as { data?: { message?: string } })?.data?.message;

  useEffect(() => {
    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        setError(field as keyof RegisterFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data).unwrap();
      router.push("/login");
    } catch {
      // Error handled by RTK Query
    }
  };

  const inputClass = (field?: boolean) =>
    `w-full px-4 py-3 border rounded-lg text-sm text-darkText focus:outline-none focus:border-maroon transition ${
      field ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-darkText">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your details to get started
        </p>
      </div>

      {generalError && !fieldErrors && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className={inputClass(!!errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

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
            Password
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
            Confirm Password
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
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wide">
          or
        </span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-maroon font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
