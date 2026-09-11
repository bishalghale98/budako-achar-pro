"use client";

import { useState } from "react";
import { useLogoutAllMutation } from "@/features/auth/auth-api";
import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";

export function SecuritySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Security Settings</h1>

      <ChangePasswordForm />

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Sessions</h2>
          <p className="text-sm text-slate-500">Manage your active sessions</p>
        </div>

        <div className="px-6 py-5">
          {logoutAllSuccess && (
            <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">
              <AlertDescription>{logoutAllSuccess}</AlertDescription>
            </Alert>
          )}

          <p className="mb-4 text-sm text-slate-500">
            This will sign you out of all other devices and sessions. Your
            current session will remain active.
          </p>

          <Button
            variant="destructive"
            onClick={handleLogoutAll}
            disabled={isLoggingOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Signing out..." : "Sign out all other sessions"}
          </Button>
        </div>
      </div>
    </div>
  );
}
