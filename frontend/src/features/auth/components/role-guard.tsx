"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth, useHasAnyRole } from "@/features/auth/auth-hooks";
import type { Role } from "@/features/auth/auth-types";

export const roleHome: Record<string, string> = {
  admin: "/dashboard",
  customer: "/customer",
};

export function getRoleHome(role?: Role): string {
  if (!role) return "/customer";
  return roleHome[role] || "/customer";
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") return null;
  return <>{children}</>;
}

export function PublicOnlyGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(getRoleHome(user?.role));
    }
  }, [status, user, router]);

  if (status === "authenticated") return null;
  return <>{children}</>;
}

export function RoleGuard({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { status, user } = useAuth();
  const allowed = useHasAnyRole(roles);

  useEffect(() => {
    if (status !== "authenticated" || !user || allowed) return;
    router.replace(getRoleHome(user.role));
  }, [status, user, allowed, router]);

  if (status !== "authenticated" || !allowed) return null;
  return <>{children}</>;
}
