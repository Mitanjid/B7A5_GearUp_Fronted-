"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <Card className="w-full rounded-2xl text-center shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" />
          </div>
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={reset}
            >
              Try again
            </Button>
            <Button
              className="w-full rounded-full"
              nativeButton={false}
              render={<Link href="/">Go home</Link>}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
