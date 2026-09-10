"use client";

import { useState } from "react";
import { useSendVerificationEmailMutation } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Please verify your email address to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your email address. Check your inbox
          and click the link to verify your account.
        </p>

        {message && (
          <Alert variant={isError ? "destructive" : "default"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Resend verification email"}
        </Button>
      </CardContent>
    </Card>
  );
}
