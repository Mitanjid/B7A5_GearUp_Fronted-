import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProviderCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-border/60 bg-card p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Got gear collecting dust in the garage?
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            List it on GearUp and earn money from equipment that&apos;s already
            sitting idle between your own trips.
          </p>
        </div>
        <Button
          size="lg"
          className="shrink-0 gap-2 rounded-full"
          nativeButton={false}
          render={
            <Link href="/register">
              Become a Provider
              <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>
    </section>
  );
}
