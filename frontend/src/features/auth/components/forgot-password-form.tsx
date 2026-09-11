"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/features/auth/auth-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const fieldErrors = (error as { data?: { errors?: Record<string, string[]> } })?.data?.errors;
  const generalError = (error as { data?: { message?: string } })?.data?.message;

  useEffect(() => {
    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        setError(field as keyof ForgotPasswordFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const result = await forgotPassword(data).unwrap();
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
            Check Your Email
          </h1>
          <p className="text-gray-500 text-sm">{successMessage}</p>
        </div>
        <Link
          href="/login"
          className="block w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm text-center"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-darkText">
          Forgot Password?
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {generalError && !fieldErrors && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-500">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={errors.email ? "border-destructive" : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition shadow-sm text-sm disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
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
        Remember your password?{" "}
        <Link href="/login" className="text-maroon font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
