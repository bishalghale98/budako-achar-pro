"use client";

import { ProfileContent } from "@/features/settings/components/profile-content";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export default function CustomerProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileContent />
      <ChangePasswordForm />
    </div>
  );
}
