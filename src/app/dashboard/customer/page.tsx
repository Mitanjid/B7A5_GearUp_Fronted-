"use client";

import { useAuthStore } from "@/store/auth-store";

export default function CustomerDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
      <p className="text-muted-foreground">This is your customer dashboard.</p>
    </div>
  );
}
