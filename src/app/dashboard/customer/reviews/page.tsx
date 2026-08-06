"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { getCustomerRentals } from "../_action/rental.action";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewDialog } from "../_components/review-dialog";

export default function CustomerReviewsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ["customer-rentals"],
    queryFn: () => getCustomerRentals(accessToken!),
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  const rentals = data?.data ?? [];
  const pendingReview = rentals.filter(
    (r) => r.status === "RETURNED" && !r.review,
  );
  const reviewed = rentals.filter((r) => r.review);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">My Reviews</h1>
      <p className="mb-6 text-muted-foreground">
        Feedback you&apos;ve left for gear you&apos;ve rented.
      </p>

      {pendingReview.length === 0 && reviewed.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Star className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              No returned rentals to review yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {pendingReview.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                Awaiting Your Review
              </h2>
              <div className="space-y-3">
                {pendingReview.map((rental) => (
                  <Card key={rental.id} className="border-border/60 shadow-sm">
                    <CardContent className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-semibold">{rental.gearItem.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rental.startDate).toLocaleDateString()} -{" "}
                          {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <ReviewDialog rentalOrderId={rental.id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {reviewed.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                Your Reviews
              </h2>
              <div className="space-y-3">
                {reviewed.map((rental) => (
                  <Card key={rental.id} className="border-border/60 shadow-sm">
                    <CardContent className="space-y-2 p-5">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{rental.gearItem.name}</p>
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
                      </div>
                      {rental.review!.comment && (
                        <p className="text-sm text-muted-foreground">
                          &quot;{rental.review!.comment}&quot;
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          rental.review!.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
