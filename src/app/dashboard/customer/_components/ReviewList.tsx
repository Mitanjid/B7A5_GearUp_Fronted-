"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { getGearReviews } from "../_action/review.action";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewList({ gearItemId }: { gearItemId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["gear-reviews", gearItemId],
    queryFn: () => getGearReviews(gearItemId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const reviews = data?.data ?? [];

  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              {review.customer?.name ?? "Customer"}
            </p>

            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>

          {review.comment && (
            <p className="mt-2 text-sm text-muted-foreground">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
