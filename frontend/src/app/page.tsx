"use client";

import Link from "next/link";
import { useUser, useIsLoading } from "@/features/auth/auth-hooks";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";

export default function Home() {
  const user = useUser();
  const isLoading = useIsLoading();

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (user) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-heading text-xl font-bold sm:text-2xl">
              Welcome, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              You are logged in as{" "}
              <span className="font-medium text-foreground">
                {user.email}
              </span>
            </p>
            <Link href="/dashboard" className={buttonVariants({ className: "mt-2" })}>
              Go to Dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-xl font-bold sm:text-2xl">
            Laravel Sanctum SPA
          </h1>
          <p className="max-w-sm text-muted-foreground">
            Authentication with Next.js and RTK Query
          </p>
          <div className="flex gap-3">
            <Link href="/login" className={buttonVariants()}>
              Login
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline" })}
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
