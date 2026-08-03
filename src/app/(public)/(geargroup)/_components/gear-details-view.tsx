"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getGearById } from "../gear.action";
import { RentNowDialog } from "./rent-now-dialog";  

export function GearDetailsView({ gearId }: { gearId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["gear", gearId],
    queryFn: () => getGearById(gearId),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-destructive">
        Gear not found.
      </div>
    );
  }

  const gear = data.data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full rounded-lg bg-muted">
          {gear.imageUrl ? (
            <Image
              src={gear.imageUrl}
              alt={gear.name}
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">{gear.name}</h1>
            <Badge variant="secondary">{gear.category.name}</Badge>
          </div>

          {gear.brand && (
            <p className="text-muted-foreground">Brand: {gear.brand}</p>
          )}

          <p className="text-2xl font-bold">
            ${gear.pricePerDay}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </p>

          <p>{gear.description}</p>

          <p className="text-sm text-muted-foreground">
            Provided by {gear.provider.name}
          </p>

          <p className="text-sm">
            Stock: {gear.stock}{" "}
            {gear.isAvailable ? "(Available)" : "(Unavailable)"}
          </p>

          {gear.isAvailable && <RentNowDialog gearId={gearId} />}
        </div>
      </div>
    </div>
  );
}
