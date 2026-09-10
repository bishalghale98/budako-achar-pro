"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/features/auth/auth-hooks";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const user = useUser();
  const [open, setOpen] = useState(false);

  const navLinks = user ? (
    <>
      <Link
        href="/dashboard"
        className="block py-2 text-sm font-medium text-foreground hover:underline"
        onClick={() => setOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        href="/settings/profile"
        className="block py-2 text-sm font-medium text-foreground hover:underline"
        onClick={() => setOpen(false)}
      >
        Settings
      </Link>
      <Separator className="my-2" />
      <LogoutButton
        variant="ghost"
        className="w-full justify-start px-0"
        onLogoutSuccess={() => setOpen(false)}
      />
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="block py-2 text-sm font-medium text-foreground hover:underline"
        onClick={() => setOpen(false)}
      >
        Login
      </Link>
      <Link
        href="/register"
        className="block py-2 text-sm font-medium text-foreground hover:underline"
        onClick={() => setOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12  max-w-7xl p-6 items-center justify-between px-4 sm:h-14">
        <Link href="/" className="font-serif text-base font-bold text-maroon">
          Buda Ko Achar
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <span className="mr-2 text-sm text-muted-foreground">
                {user.name}
              </span>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Dashboard
              </Link>
              <Link
                href="/settings/profile"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Settings
              </Link>
              <LogoutButton variant="ghost" size="sm" />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ size: "sm" })}
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="sm:hidden"
                aria-label="Open menu"
              />
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">{navLinks}</nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
