import { useAppSelector } from "@/store/hooks";
import type { Role } from "./auth-types";
import { hasRole, hasAnyRole } from "./auth-utils";

export function useAuth() {
  return useAppSelector((state) => state.auth);
}

export function useUser() {
  return useAppSelector((state) => state.auth.user);
}

export function useRole() {
  return useAppSelector((state) => state.auth.user?.role);
}

export function useIsAuthenticated() {
  return useAppSelector((state) => state.auth.status === "authenticated");
}

export function useIsLoading() {
  return useAppSelector((state) => state.auth.status === "loading");
}

export function useHasRole(role: Role) {
  const userRole = useRole();
  return hasRole(role, userRole);
}

export function useHasAnyRole(roles: Role[]) {
  const userRole = useRole();
  return hasAnyRole(roles, userRole);
}

export function useIsAdmin() {
  return useHasRole("admin");
}
