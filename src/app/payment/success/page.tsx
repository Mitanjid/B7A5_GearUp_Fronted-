"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">(() =>
    sessionId ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = useState(
    sessionId ? "" : "Missing session ID.",
  );

  useEffect(() => {
    if (!sessionId) return;

    apiClient
      .get(`/api/payments/confirm?session_id=${sessionId}`)
      .then(() => setStatus("success"))
      .catch((error) => {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Payment confirmation failed",
        );
      });
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="rounded-2xl text-center shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          {status === "loading" && (
            <>
              <Loader2 className="size-16 animate-spin text-primary" />
              <h1 className="text-2xl font-bold">Confirming Payment...</h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="size-16 text-green-500" />
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your rental order has been confirmed and paid.
              </p>
              <Button
                className="w-full rounded-full"
                nativeButton={false}
                render={
                  <Link href="/dashboard/customer/orders">View My Orders</Link>
                }
              />
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="size-16 text-destructive" />
              <h1 className="text-2xl font-bold">Confirmation Failed</h1>
              <p className="text-muted-foreground">{errorMessage}</p>
              <Button
                className="w-full rounded-full"
                variant="outline"
                nativeButton={false}
                render={
                  <Link href="/dashboard/customer/orders">Back to Orders</Link>
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
