"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from "lucide-react";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-64 rounded-2xl" />
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Personal Information</h2>
          <p className="text-sm text-slate-500">Update your personal details</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                required
                autoComplete="name"
                aria-invalid={!!fieldErrors?.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
              />
              {fieldErrors?.name && (
                <p className="text-sm text-red-500">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={!!fieldErrors?.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
              {fieldErrors?.email && (
                <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-maroon text-white hover:bg-maroon-hover gap-2"
              >
                <Save className="h-4 w-4" />
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
