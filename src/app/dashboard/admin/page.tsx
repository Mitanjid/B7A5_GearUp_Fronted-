"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
      <p className="text-muted-foreground">This is your admin dashboard.</p>

      <div className="mt-4 flex gap-3">
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
      </div>
    </div>
  );
}
