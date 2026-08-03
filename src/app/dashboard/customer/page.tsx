"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
      <p className="text-muted-foreground">This is your customer dashboard.</p>

      <div className="mt-4">
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/customer/orders">View My Orders</Link>}
        />
      </div>
    </div>
  );
}
