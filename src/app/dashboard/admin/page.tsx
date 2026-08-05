"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Users,
  Dumbbell,
  Package,
  Tags,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import { getAdminStats } from "./_action/admin.action";
import { StatCard } from "./_components/stat-card";
import { RecentActivity } from "./_components/recent-activity";

const quickActions = [
  {
    href: "/dashboard/admin/users",
    label: "Manage Users",
    description: "View and manage users",
    icon: Users,
    iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/dashboard/admin/gear",
    label: "Gear",
    description: "Manage listed equipment",
    icon: Dumbbell,
    iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    href: "/dashboard/admin/rentals",
    label: "Rentals",
    description: "Track rental activity",
    icon: Package,
    iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    href: "/dashboard/admin/categories",
    label: "Categories",
    description: "Organize gear categories",
    icon: Tags,
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

export default function AdminDashboardPage() {
  const { user, accessToken } = useAuthStore();

  const {
    data: stats,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(accessToken!),
    enabled: !!accessToken,
  });

  return (
    <div className="min-h-full bg-background">
      <div className="space-y-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
          
         



          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-primary">
                Admin Dashboard
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                👋 Welcome back, {user?.name}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Manage your GearUp platform, users, gear and rentals from one
                place.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="w-fit gap-2 rounded-xl bg-background/80"
            >
              <RefreshCw
                className={isFetching ? "size-4 animate-spin" : "size-4"}
              />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Overview</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening on your platform.
            </p>
          </div>

          {isError ? (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="size-4" />

              <AlertTitle>Couldn&apos;t load dashboard stats</AlertTitle>

              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Something went wrong."}
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Users}
                label="Users"
                value={stats?.totalUsers ?? 0}
                subtitle={
                  stats?.newUsersThisWeek
                    ? `+${stats.newUsersThisWeek} this week`
                    : "No new users this week"
                }
                colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
              />

              <StatCard
                icon={Dumbbell}
                label="Gear"
                value={stats?.activeGear ?? 0}
                subtitle={`${stats?.totalGear ?? 0} total listed`}
                colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
              />

              <StatCard
                icon={Package}
                label="Rentals"
                value={stats?.totalRentals ?? 0}
                subtitle={`${stats?.pendingRentals ?? 0} pending`}
                colorClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
              />

              <StatCard
                icon={Tags}
                label="Categories"
                value={stats?.totalCategories ?? 0}
                subtitle="Active categories"
                colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              />
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Quickly access common admin tasks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link key={action.href} href={action.href} className="group">
                  <Card className="h-full rounded-2xl border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${action.iconClass}`}
                      >
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{action.label}</p>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>

                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
              <CardTitle className="text-base">Recent Activity</CardTitle>

              <p className="text-sm text-muted-foreground">
                Latest activity across your platform.
              </p>
            </CardHeader>

            <CardContent className="px-5 sm:px-6">
              {isLoading ? (
                <div className="space-y-3 py-2">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ) : (
                <RecentActivity items={stats?.recentActivity ?? []} />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
