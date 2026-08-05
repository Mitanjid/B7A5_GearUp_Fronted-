"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

import { getProviderStats } from "./_actions/stats.action";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Package,
  ClipboardList,
  Clock3,
  Plus,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

const quickActions = [
  {
    href: "/dashboard/provider/gear",
    label: "Manage My Gear",
    description: "View and manage your listed equipment",
    icon: Package,
    iconClass: "bg-blue-500/10 text-blue-600",
  },
  {
    href: "/dashboard/provider/gear/new",
    label: "Add New Gear",
    description: "List new equipment for rental",
    icon: Plus,
    iconClass: "bg-emerald-500/10 text-emerald-600",
  },
  {
    href: "/dashboard/provider/orders",
    label: "Manage Orders",
    description: "Review and manage rental orders",
    icon: ClipboardList,
    iconClass: "bg-violet-500/10 text-violet-600",
  },
];

export default function ProviderDashboardPage() {
  const { user, accessToken } = useAuthStore();

  const {
    data: stats,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["provider-stats"],
    queryFn: () => getProviderStats(accessToken!),
    enabled: !!accessToken,
  });

  return (
    <div className="min-h-full w-full space-y-8 bg-background text-foreground">
      {/* Welcome Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-primary">
              Provider Dashboard
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              👋 Welcome back, {user?.name}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Manage your gear, track rentals, and keep your orders organized
              from one place.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-fit gap-2 rounded-xl bg-background/70"
          >
            <RefreshCw
              className={isFetching ? "size-4 animate-spin" : "size-4"}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </section>

      {/* Overview */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Overview</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s a quick look at your provider activity.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Gear */}
            <Card className="rounded-2xl border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Gear
                </CardTitle>

                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <Package className="size-5" />
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold tracking-tight">
                  {stats?.totalGear ?? 0}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Equipment currently listed
                </p>
              </CardContent>
            </Card>

            {/* Active Rentals */}
            <Card className="rounded-2xl border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Rentals
                </CardTitle>

                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Clock3 className="size-5" />
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold tracking-tight">
                  {stats?.activeRentals ?? 0}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Currently rented equipment
                </p>
              </CardContent>
            </Card>

            {/* Pending Orders */}
            <Card className="rounded-2xl border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </CardTitle>

                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <ClipboardList className="size-5" />
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold tracking-tight">
                  {stats?.pendingOrders ?? 0}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Orders waiting for action
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Quickly access your most common provider tasks.
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

      {/* Provider Tip / Empty State */}
      <section>
        <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Keep your gear up to date</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add new equipment or update your existing listings to keep your
                store active.
              </p>
            </div>

            <Button
              nativeButton={false}
              className="w-fit rounded-xl"
              render={
                <Link href="/dashboard/provider/gear/new">
                  <Plus className="mr-2 size-4" />
                  Add Gear
                </Link>
              }
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
