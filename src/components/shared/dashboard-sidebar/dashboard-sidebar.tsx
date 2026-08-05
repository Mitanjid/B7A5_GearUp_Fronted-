"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Boxes,
  Tags,
  Star,
  PlusCircle,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navConfig: Record<"CUSTOMER" | "PROVIDER" | "ADMIN", NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/customer/orders",
      label: "My Orders",
      icon: ClipboardList,
    },
    { href: "/dashboard/customer/reviews", label: "My Reviews", icon: Star },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/provider/gear", label: "My Gear", icon: Package },
    {
      href: "/dashboard/provider/gear/new",
      label: "Add Gear",
      icon: PlusCircle,
    },
    {
      href: "/dashboard/provider/orders",
      label: "Orders",
      icon: ClipboardList,
    },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/gear", label: "Gear", icon: Boxes },
    { href: "/dashboard/admin/rentals", label: "Rentals", icon: ClipboardList },
    { href: "/dashboard/admin/categories", label: "Categories", icon: Tags },
  ],
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const items = navConfig[user.role];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border/40 bg-background/70 backdrop-blur-xl md:block">
      <nav className="flex flex-col gap-1 p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {user.role === "ADMIN"
            ? "Admin Panel"
            : user.role === "PROVIDER"
              ? "Provider Panel"
              : "My Account"}
        </p>

        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${user.role.toLowerCase()}` &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
