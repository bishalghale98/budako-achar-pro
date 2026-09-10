import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-sm h-96 animate-pulse bg-muted" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
