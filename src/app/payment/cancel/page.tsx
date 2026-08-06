import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="rounded-2xl text-center shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <XCircle className="size-16 text-destructive" />
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was not completed.
          </p>
          <Button
            className="w-full rounded-full"
            variant="outline"
            nativeButton={false}
            render={
              <Link href="/dashboard/customer/orders">Back to Orders</Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
