"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { useLogoutMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";

type ButtonElementProps = ComponentProps<typeof Button>;

interface LogoutButtonProps extends ButtonElementProps {
  redirectPath?: string;
  onLogoutSuccess?: () => void;
}

export function LogoutButton({
  children = "Sign out",
  variant = "ghost",
  redirectPath = "/login",
  onLogoutSuccess,
  className,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignore API errors, proceed with local logout
    } finally {
      onLogoutSuccess?.();
      router.replace(redirectPath);
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      disabled={isLoading || isLoggingOut}
      onClick={handleLogout}
      {...props}
    >
      {isLoading || isLoggingOut ? "Signing out..." : children}
    </Button>
  );
}
