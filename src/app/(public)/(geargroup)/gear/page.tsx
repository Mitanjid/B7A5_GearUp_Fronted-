"use client";

import { useQuery } from "@tanstack/react-query";

import { GearCard } from "../_components/gear-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllGear } from "../_action/gear.action";

export default function GearBrowsePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["gear"],
    queryFn: () => getAllGear(),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Browse Gear</h1>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-destructive">
          Failed to load gear. Please try again later.
        </p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-center text-muted-foreground">No gear found.</p>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      )}
    </div>
  );
}
