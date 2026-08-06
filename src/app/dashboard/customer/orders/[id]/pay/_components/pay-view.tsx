"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { createPaymentSession } from "@/app/dashboard/customer/_action/payment.action";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function PayView({ rentalOrderId }: { rentalOrderId: string }) {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
     
    if (!accessToken) {
         
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      const res = await createPaymentSession(rentalOrderId, accessToken);
      window.location.href = res.data.checkoutUrl;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment initiation failed",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="rounded-2xl text-center shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CreditCard className="size-7" />
          </div>
          <h1 className="text-xl font-bold">Complete Your Payment</h1>
          <p className="text-sm text-muted-foreground">
            You&apos;ll be redirected to a secure Stripe checkout page.
          </p>
          <Button
            onClick={handlePay}
            disabled={isLoading}
            className="w-full rounded-full"
          >
            {isLoading ? "Redirecting..." : "Proceed to Payment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
