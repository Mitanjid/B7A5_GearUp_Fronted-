"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminStats } from "./_action/admin.action";

export default function AdminDashboardPage() {
  const { user, accessToken } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(accessToken!),
    enabled: !!accessToken,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>

      {isLoading ? (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalUsers ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Active Gear
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalGear ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Total Rentals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalRentals ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/admin/users">Manage Users</Link>}
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/admin/gear">View All Gear</Link>}
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/admin/rentals">View All Rentals</Link>}
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/dashboard/admin/categories">Manage Categories</Link>
          }
        />
      </div>
    </div>
  );
}
