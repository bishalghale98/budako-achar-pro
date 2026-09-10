"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full max-w-sm" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
