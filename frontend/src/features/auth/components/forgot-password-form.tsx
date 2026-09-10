"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/features/auth/auth-api";
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
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-xl">Check your email</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-xl">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {generalError && !fieldErrors && (
            <Alert variant="destructive">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
