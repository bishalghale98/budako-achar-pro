import type { Role } from "./auth-types";

export function hasRole(role: Role, userRole?: Role): boolean {
  if (!userRole) return false;
  return userRole.toLowerCase() === role.toLowerCase();
}

export function hasAnyRole(roles: Role[], userRole?: Role): boolean {
  if (!userRole) return false;
  return roles.some((role) => hasRole(role, userRole));
}

export function safeRedirect(targetUrl: string | null | undefined, fallback: string): string {
  if (!targetUrl) return fallback;
  // Ensure relative path starting with / and not // (to prevent open redirect vulnerabilities)
  if (targetUrl.startsWith("/") && !targetUrl.startsWith("//")) {
    return targetUrl;
  }
  return fallback;
}
