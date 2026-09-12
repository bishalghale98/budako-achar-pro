import { Suspense } from "react";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-sm h-96 animate-pulse bg-muted" />
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
