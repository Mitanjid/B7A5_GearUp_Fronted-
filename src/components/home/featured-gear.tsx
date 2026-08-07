"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, AlertCircle } from "lucide-react";
import { getAllGear } from "@/app/(public)/(geargroup)/_action/gear.action";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GearCard } from "../shared/gear-card";


export function FeaturedGear() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gear", "featured"],
    queryFn: () => getAllGear(),
  });

 const gearList = (data?.data?.data ?? []).slice(0, 8);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to rent right now
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A few things people nearby are picking up this week.
          </p>
        </div>
        <Button
          variant="ghost"
          className="gap-1"
          nativeButton={false}
          render={
            <Link href="/gear">
              View all gear <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Couldn&apos;t load gear</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Something went wrong."}
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/3 w-full rounded-2xl" />
          ))}
        </div>
      ) : gearList.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No gear listed yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {gearList.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      )}
    </section>
  );
}
