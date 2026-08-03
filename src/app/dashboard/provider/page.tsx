"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function ProviderDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
      <p className="text-muted-foreground">This is your provider dashboard.</p>

      <div className="mt-4 flex gap-3">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/provider/gear">Manage My Gear</Link>}
        />

        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/provider/orders">Manage Orders</Link>}
        />

        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/provider/gear/new">Add New Gear</Link>}
        />
      </div>
    </div>
  );
}
