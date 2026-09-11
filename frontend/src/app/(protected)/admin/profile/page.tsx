"use client";

import { ProfileContent } from "@/features/settings/components/profile-content";
import { SecurityContent } from "@/features/settings/components/security-content";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileContent />
      <SecurityContent />
    </div>
  );
}
