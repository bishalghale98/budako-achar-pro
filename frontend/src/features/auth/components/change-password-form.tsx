"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChangePasswordMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

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
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <Alert className="mb-4">
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
            <Label htmlFor="current_password">Current password</Label>
            <Input
              id="current_password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.current_password}
              aria-describedby={errors.current_password ? "current-password-error" : undefined}
              {...register("current_password")}
            />
            {errors.current_password && (
              <p id="current-password-error" className="text-sm text-destructive">
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm new password</Label>
            <Input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password_confirmation}
              aria-describedby={errors.password_confirmation ? "password-confirmation-error" : undefined}
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <p id="password-confirmation-error" className="text-sm text-destructive">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Changing..." : "Change password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
