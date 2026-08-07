"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Star } from "lucide-react";
import { getCustomerRentals } from "../_action/rental.action";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/shared/back-button";
import { ReviewDialog } from "../_components/review-dialog";
import { OrderStatusTracker } from "../_components/order-status-tracker";

const statusColors: Record<string, string> = {
  PLACED: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-purple-100 text-purple-800",
  PICKED_UP: "bg-green-100 text-green-800",
  RETURNED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function CustomerOrdersPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ["customer-rentals"],
    queryFn: () => getCustomerRentals(accessToken!),
    enabled: !!accessToken,
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  const rentals = data?.data ?? [];

  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {rentals.length === 0 ? (
        <p className="text-muted-foreground">You have no rental orders yet.</p>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div key={rental.id} className="space-y-3 rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{rental.gearItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(rental.startDate).toLocaleDateString()} -{" "}
                    {new Date(rental.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium">${rental.totalAmount}</p>
                </div>
                <Badge className={statusColors[rental.status]}>
                  {rental.status}
                </Badge>
              </div>

              <OrderStatusTracker status={rental.status} variant="compact" />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <Link
                  href={`/dashboard/customer/orders/${rental.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Details
                </Link>

                <div className="flex items-center gap-3">
                  {rental.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/dashboard/customer/orders/${rental.id}/pay`}
                        >
                          Pay Now
                        </Link>
                      }
                    />
                  )}

                  {rental.status === "RETURNED" &&
                    (rental.review ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i <= rental.review!.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <ReviewDialog rentalOrderId={rental.id} />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
