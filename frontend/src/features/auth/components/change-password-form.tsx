"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { changePasswordSchema, type ChangePasswordFormValues } from "./auth-schemas";

export function ChangePasswordForm() {
  const [changePassword, { isLoading, error }] = useChangePasswordMutation();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });

  const fieldErrors = (error as { data?: { errors?: Record<string, string[]> } })?.data?.errors;
  const generalError = (error as { data?: { message?: string } })?.data?.message;

  useEffect(() => {
    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        setError(field as keyof ChangePasswordFormValues, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setSuccessMessage("");
    try {
      const result = await changePassword(data).unwrap();
      setSuccessMessage(result.message);
      reset();
    } catch {
      // Error handled by RTK Query
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="font-semibold text-slate-900">Change Password</h2>
        <p className="text-sm text-slate-500">Update your password to keep your account secure</p>
      </div>

      <div className="px-6 py-5">
        {successMessage && (
          <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {generalError && !fieldErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password" className="text-sm font-medium text-slate-700">
              Current Password
            </Label>
            <Input
              id="current_password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.current_password}
              aria-describedby={errors.current_password ? "current-password-error" : undefined}
              {...register("current_password")}
              className="h-10"
            />
            {errors.current_password && (
              <p id="current-password-error" className="text-sm text-red-500">
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              className="h-10"
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
              Confirm New Password
            </Label>
            <Input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password_confirmation}
              aria-describedby={errors.password_confirmation ? "password-confirmation-error" : undefined}
              {...register("password_confirmation")}
              className="h-10"
            />
            {errors.password_confirmation && (
              <p id="password-confirmation-error" className="text-sm text-red-500">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-maroon text-white hover:bg-maroon-hover gap-2"
            >
              <Lock className="h-4 w-4" />
              {isLoading ? "Changing..." : "Change password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
