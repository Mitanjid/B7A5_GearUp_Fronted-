"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
 if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "CUSTOMER") {
      router.push("/");
    }
  }, [isAuthenticated, user, router, hasHydrated]);

  if (!isAuthenticated || user?.role !== "CUSTOMER" || !hasHydrated) {
    return null;
  }

  return <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>;
}


