"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { getRentalOrderById } from "../../_action/rental.action";
import { BackButton } from "@/components/shared/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { OrderStatusTracker } from "../../_components/order-status-tracker";
import { ReviewDialog } from "../../_components/review-dialog";

const statusColors: Record<string, string> = {
  PLACED: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-purple-100 text-purple-800",
  PICKED_UP: "bg-green-100 text-green-800",
  RETURNED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [id, setId] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customer-rental", id],
    queryFn: () => getRentalOrderById(id!, accessToken!),
    enabled: !!accessToken && !!id,
    refetchInterval: 15000,
  });

  if (isLoading || !id) {
    return (
      <div>
        <BackButton />
        <Skeleton className="h-56 w-full max-w-2xl" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div>
        <BackButton />
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Couldn&apos;t load this order</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Order not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const rental = data.data;

  return (
    <div className="max-w-2xl">
      <BackButton />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground">
            Order #{rental.id.slice(0, 8)}
          </p>
        </div>
        <Badge className={statusColors[rental.status]}>{rental.status}</Badge>
      </div>

      {/* Gear summary */}
      <div className="mt-6 flex gap-4 rounded-xl border p-4">
        {rental.gearItem.imageUrl && (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={rental.gearItem.imageUrl}
              alt={rental.gearItem.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className="font-semibold">{rental.gearItem.name}</p>
          <p className="text-sm text-muted-foreground">
            Provided by {rental.gearItem.provider.name}
          </p>
          <p className="mt-1 text-sm">
            {new Date(rental.startDate).toLocaleDateString()} -{" "}
            {new Date(rental.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tracker */}
      <div className="mt-8 rounded-xl border p-6">
        <h2 className="mb-6 text-sm font-semibold text-muted-foreground">
          Order Progress
        </h2>
        <OrderStatusTracker status={rental.status} variant="detailed" />
      </div>

      {/* Payment info */}
      <div className="mt-6 rounded-xl border p-4">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Payment
        </h2>
        <div className="flex items-center justify-between text-sm">
          <span>Total Amount</span>
          <span className="font-semibold">${rental.totalAmount}</span>
        </div>
        {rental.payments.length > 0 ? (
          <div className="mt-3 space-y-2">
            {rental.payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{p.method}</span>
                <Badge className={paymentStatusColors[p.status]}>
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No payment initiated yet.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {rental.status === "CONFIRMED" && (
          <Button
            nativeButton={false}
            render={
              <Link href={`/dashboard/customer/orders/${rental.id}/pay`}>
                Pay Now
              </Link>
            }
          />
        )}
        {rental.status === "RETURNED" && !rental.review && (
          <ReviewDialog rentalOrderId={rental.id} />
        )}
      </div>
    </div>
  );
}
