import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-sm h-96 animate-pulse bg-muted" />
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
