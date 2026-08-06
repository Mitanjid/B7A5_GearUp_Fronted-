"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Hero() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            Rent from local providers, not warehouses
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Whatever the adventure,{" "}
            <span className="text-primary">someone nearby</span> has the gear.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            Tents, bikes, kayaks, skis, cameras — rent it for the weekend,
            return it Monday. No storage, no buyer&apos;s remorse.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="gap-2 rounded-full"
              nativeButton={false}
              render={
                <Link href="/gear">
                  Browse Gear
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
            {!isAuthenticated && (
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                nativeButton={false}
                render={<Link href="/register">List Your Gear</Link>}
              />
            )}
          </div>
        </div>

        <div className="relative hidden aspect-4/5 w-full overflow-hidden rounded-3xl border border-border/40 lg:block">
          <Image
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&q=80"
            alt="Camping tent set up in the mountains"
            fill
            sizes="(min-width: 1024px) 40vw, 0px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
