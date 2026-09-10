"use client";

import { useRouter } from "next/navigation";
import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="mb-6 h-7 w-32" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  );
}

export function DashboardContent() {
  const router = useRouter();
  const user = useUser();
  const isLoading = useIsLoading();

  if (isLoading) return <DashboardSkeleton />;
  if (!user) return null;

  const isUnverified = !user.email_verified_at;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader title="Dashboard" />

      {isUnverified && (
        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Please verify your email address.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/settings/security")}
            >
              Verify email
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <section className="rounded-lg border bg-background p-4 sm:border-border sm:bg-card">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Profile
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <Separator />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <Separator />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Verified</dt>
              <dd className="font-medium">
                {user.email_verified_at ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border bg-background p-4 sm:border-border sm:bg-card">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Session
          </h2>
          <LogoutButton variant="destructive">Sign out</LogoutButton>
        </section>
      </div>
    </div>
  );
}
