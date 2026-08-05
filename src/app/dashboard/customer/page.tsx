"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  ShoppingBag,
  Star,
  ArrowUpRight,
  Search,
  ClipboardList,
} from "lucide-react";

const quickActions = [
  {
    href: "/dashboard/customer/orders",
    label: "My Orders",
    description: "View and track your rental orders",
    icon: ClipboardList,
    iconClass: "bg-blue-500/10 text-blue-600",
  },
  {
    href: "/dashboard/customer/reviews",
    label: "My Reviews",
    description: "Manage your gear reviews",
    icon: Star,
    iconClass: "bg-amber-500/10 text-amber-600",
  },
  {
    href: "/gear",
    label: "Browse Gear",
    description: "Find sports and outdoor equipment",
    icon: Search,
    iconClass: "bg-emerald-500/10 text-emerald-600",
  },
];

export default function CustomerDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-full w-full space-y-8 bg-background text-foreground">
      {/* Welcome Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-primary">
              Customer Dashboard
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              👋 Welcome back, {user?.name}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Manage your rental orders, reviews, and discover new gear from
              your dashboard.
            </p>
          </div>

          <Button
            nativeButton={false}
            className="w-fit rounded-xl"
            render={
              <Link href="/gear">
                <Search className="mr-2 size-4" />
                Browse Gear
              </Link>
            }
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Quickly access your most common activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.href} href={action.href} className="group">
                <Card className="h-full rounded-2xl border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${action.iconClass}`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{action.label}</p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Start Renting */}
      <section>
        <Card className="overflow-hidden rounded-2xl border-border/70 bg-card shadow-sm">
          <CardContent className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="size-5" />
              </div>

              <div>
                <h2 className="font-semibold">Ready to rent some gear?</h2>

                <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
                  Explore available sports and outdoor equipment and find the
                  right gear for your next activity.
                </p>
              </div>
            </div>

            <Button
              nativeButton={false}
              className="relative w-fit shrink-0 rounded-xl"
              render={
                <Link href="/gear">
                  Browse Gear
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              }
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
