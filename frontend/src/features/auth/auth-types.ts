export type Role = "customer" | "admin";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type User = {
  id: number;
  name: string;
  email: string;
  role?: Role;
  email_verified_at: string | null;
  created_at?: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user: User;
};

export type MeResponse = {
  success: boolean;
  user: User;
};

export type MessageResponse = {
  success: boolean;
  message: string;
};
