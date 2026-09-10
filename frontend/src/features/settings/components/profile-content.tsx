"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="mb-6 h-7 w-24" />
      <Skeleton className="h-64" />
    </div>
  );
}

export function ProfileContent() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating, error }] = useUpdateProfileMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isLoading && isError) {
      router.push("/login");
    }
  }, [isLoading, isError, router]);

  if (data?.user && !initialized) {
    setName(data.user.name);
    setEmail(data.user.email);
    setInitialized(true);
  }

  const fieldErrors = (error as { data?: { errors?: Record<string, string[]> } })?.data?.errors;
  const generalError = (error as { data?: { message?: string } })?.data?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    try {
      await updateProfile({ name, email }).unwrap();
      setSuccessMessage("Profile updated successfully.");
    } catch {
      // Error handled by RTK Query
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !data?.user) return null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader title="Profile" />

      <section className="rounded-lg border bg-background p-4 sm:border-border sm:bg-card">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Personal information
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              required
              autoComplete="name"
              aria-invalid={!!fieldErrors?.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {fieldErrors?.name && (
              <p className="text-sm text-destructive">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              aria-invalid={!!fieldErrors?.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors?.email && (
              <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </section>
    </div>
  );
}
