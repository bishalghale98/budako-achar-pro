"use client";

import { useState } from "react";
import { useLogoutAllMutation } from "@/features/auth/auth-api";
import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared";

export function SecuritySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="mb-6 h-7 w-28" />
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
    </div>
  );
}

export function SecurityContent() {
  const user = useUser();
  const isLoading = useIsLoading();
  const [logoutAll, { isLoading: isLoggingOut }] = useLogoutAllMutation();
  const [logoutAllSuccess, setLogoutAllSuccess] = useState("");

  const handleLogoutAll = async () => {
    try {
      await logoutAll().unwrap();
      setLogoutAllSuccess("All other sessions have been terminated.");
    } catch {
      // handled
    }
  };

  if (isLoading) return <SecuritySkeleton />;
  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader title="Security" />

      <div className="space-y-4">
        <ChangePasswordForm />

        <section className="rounded-lg border bg-background p-4 sm:border-border sm:bg-card">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">
            Sessions
          </h2>
          <Separator className="mb-4" />

          {logoutAllSuccess && (
            <Alert className="mb-4">
              <AlertDescription>{logoutAllSuccess}</AlertDescription>
            </Alert>
          )}

          <p className="mb-4 text-sm text-muted-foreground">
            This will sign you out of all other devices and sessions. Your
            current session will remain active.
          </p>

          <Button
            variant="destructive"
            onClick={handleLogoutAll}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Signing out..." : "Sign out all other sessions"}
          </Button>
        </section>
      </div>
    </div>
  );
}
