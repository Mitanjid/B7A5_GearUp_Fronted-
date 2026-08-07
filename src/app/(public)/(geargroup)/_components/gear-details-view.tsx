"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getGearById } from "../_action/gear.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/shared/back-button";
import { RentNowDialog } from "./rent-now-dialog";

import { ReviewList } from "@/app/dashboard/customer/_components/ReviewList";

export function GearDetailsView({ gearId }: { gearId: string }) {
  // =========================
  // Get Gear
  // =========================

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gear", gearId],
    queryFn: () => getGearById(gearId),
  });

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-6 h-10 w-24" />

        <div className="grid gap-10 md:grid-cols-2">
          <Skeleton className="h-500px w-full rounded-2xl" />

          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <BackButton />

        <div className="mt-12 text-center">
          <h1 className="text-2xl font-bold">Gear not found</h1>

          <p className="mt-2 text-muted-foreground">
            The gear item you are looking for does not exist or could not be
            loaded.
          </p>
        </div>
      </div>
    );
  }

  const gear = data.data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* =========================
          Back Button
      ========================= */}

      <BackButton />

      {/* =========================
          Main Details
      ========================= */}

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* =========================
            Image
        ========================= */}

        <div className="relative overflow-hidden rounded-2xl border bg-muted/30">
          {gear.imageUrl ? (
            <div className="relative aspect-square w-full">
              <Image
                src={gear.imageUrl}
                alt={gear.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>

        {/* =========================
            Details
        ========================= */}

        <div className="flex flex-col justify-center space-y-6">
          {/* Title */}

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="secondary">{gear.category.name}</Badge>

              {gear.isAvailable ? (
                <Badge>Available</Badge>
              ) : (
                <Badge variant="destructive">Unavailable</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {gear.name}
            </h1>

            {gear.brand && (
              <p className="mt-2 text-muted-foreground">
                Brand:{" "}
                <span className="font-medium text-foreground">
                  {gear.brand}
                </span>
              </p>
            )}
          </div>

          {/* Price */}

          <div className="rounded-2xl border bg-muted/30 p-5">
            <p className="text-sm text-muted-foreground">Rental price</p>

            <div className="mt-1">
              <span className="text-3xl font-bold">${gear.pricePerDay}</span>

              <span className="ml-1 text-muted-foreground">/ day</span>
            </div>
          </div>

          {/* Description */}

          <div>
            <h2 className="mb-2 text-lg font-semibold">About this gear</h2>

            <p className="leading-7 text-muted-foreground">
              {gear.description || "No description available for this gear."}
            </p>
          </div>

          {/* Provider */}

          <div className="rounded-2xl border p-5">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Provided by
            </p>

            <p className="font-semibold">{gear.provider.name}</p>

            <p className="text-sm text-muted-foreground">
              {gear.provider.email}
            </p>
          </div>

          {/* Stock */}

          <div className="flex items-center justify-between rounded-xl border px-4 py-3">
            <span className="text-sm font-medium">Available stock</span>

            <span className="font-semibold">{gear.stock}</span>
          </div>

          {/* Rent */}

          {gear.isAvailable && gear.stock > 0 ? (
            <RentNowDialog gearId={gear.id} />
          ) : (
            <Button disabled className="w-full rounded-xl" size="lg">
              Currently Unavailable
            </Button>
          )}
        </div>
      </div>

      {/* =========================
          Reviews
      ========================= */}

      <section className="mt-16 border-t pt-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            See what other customers say about this gear.
          </p>
        </div>

        <ReviewList gearItemId={gear.id} />
      </section>
    </div>
  );
}
