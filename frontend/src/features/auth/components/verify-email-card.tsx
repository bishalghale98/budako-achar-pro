"use client";

import { useState } from "react";
import Link from "next/link";
import { useSendVerificationEmailMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function VerifyEmailCard() {
  const [sendVerification, { isLoading }] = useSendVerificationEmailMutation();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleResend = async () => {
    setIsError(false);
    setMessage("");
    try {
      const result = await sendVerification().unwrap();
      setMessage(result.message);
    } catch {
      setIsError(true);
      setMessage("Failed to send verification email. Please try again.");
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-darkText">
          Verify Your Email
        </h1>
        <p className="text-gray-500 text-sm">
          Please verify your email address to access all features.
        </p>
      </div>

      <p className="text-sm text-gray-500">
        We sent a verification link to your email address. Check your inbox
        and click the link to verify your account.
      </p>

      {message && (
        <Alert variant={isError ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleResend}
        disabled={isLoading}
        variant="outline"
        className="w-full py-3.5 border border-maroon text-maroon font-medium rounded-lg hover:bg-maroon hover:text-white transition shadow-sm text-sm disabled:opacity-60"
      >
        {isLoading ? "Sending..." : "Resend Verification Email"}
      </Button>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wide">
          or
        </span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <p className="text-center text-sm text-gray-600">
        <Link href="/login" className="text-maroon font-bold hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
