"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getCustomerRentals } from "../_action/rental.action";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const rentals = data?.data ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {rentals.length === 0 ? (
        <p className="text-muted-foreground">You have no rental orders yet.</p>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">{rental.gearItem.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(rental.startDate).toLocaleDateString()} -{" "}
                  {new Date(rental.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium">${rental.totalAmount}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={statusColors[rental.status]}>
                  {rental.status}
                </Badge>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
