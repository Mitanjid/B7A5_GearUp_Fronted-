"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getProviderStats } from "./_actions/stats.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderDashboardPage() {
  const { user, accessToken } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["provider-stats"],
    queryFn: () => getProviderStats(accessToken!),
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
                Total Gear
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalGear ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Active Rentals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.activeRentals ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.pendingOrders ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        
        <div className="mt-6 flex gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/provider/gear">Manage My Gear</Link>}
          />
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link href="/dashboard/provider/gear/new">Add New Gear</Link>
            }
          />
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link href="/dashboard/provider/orders">Manage Orders</Link>
            }
          />
        </div>
      </div>
    </div>
  );
}
