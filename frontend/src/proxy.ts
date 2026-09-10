import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

/**
 * Laravel Sanctum SPA authentication architecture
 *
 * IMPORTANT:
 * - Do NOT check XSRF-TOKEN to determine authentication.
 * - Do NOT check laravel_session cookie presence to determine authentication.
 * - Do NOT use JWT/access tokens here.
 * - Do NOT read authentication from localStorage.
 *
 * Authentication is verified by:
 *
 *   AuthBootstrap
 *       ↓
 *   useMeQuery()
 *       ↓
 *   Laravel GET /api/me
 *       ↓
 *   authSlice
 *       ↓
 *   useAuth()
 *       ↓
 *   AuthGuard / PublicOnlyGuard / RoleGuard
 *
 * This proxy is intentionally routing-only.
 */
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/:path*",
    "/verify-email/:path*",
    "/settings/:path*",
  ],
};