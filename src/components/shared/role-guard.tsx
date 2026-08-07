"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== allowedRole) {
      router.push("/");
    }
  }, [hasHydrated, isAuthenticated, user, allowedRole, router]);

  if (!hasHydrated || !isAuthenticated || user?.role !== allowedRole) {
    return null;
  }

  return <>{children}</>; 
}
