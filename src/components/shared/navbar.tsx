"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut,
  LayoutDashboard,
  Dumbbell,
  Menu,
  X,
  Package,
  ClipboardList,
  Users,
  Boxes,
  Tags,
  Star,
  PlusCircle,
} from "lucide-react";

interface DashboardNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMobileOpen(false);
  };

  const dashboardPath =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "PROVIDER"
        ? "/dashboard/provider"
        : "/dashboard/customer";

  /*
   * Dashboard navigation
   * Overview is intentionally NOT included here.
   * Dashboard itself is available from the navbar.
   */
  const dashboardNavConfig: Record<
    "CUSTOMER" | "PROVIDER" | "ADMIN",
    DashboardNavItem[]
  > = {
    CUSTOMER: [
      {
        href: "/dashboard/customer/orders",
        label: "My Orders",
        icon: ClipboardList,
      },
      {
        href: "/dashboard/customer/reviews",
        label: "My Reviews",
        icon: Star,
      },
    ],

    PROVIDER: [
      {
        href: "/dashboard/provider/gear",
        label: "My Gear",
        icon: Package,
      },
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
      {
        href: "/dashboard/admin/users",
        label: "Users",
        icon: Users,
      },
      {
        href: "/dashboard/admin/gear",
        label: "Gear",
        icon: Boxes,
      },
      {
        href: "/dashboard/admin/rentals",
        label: "Rentals",
        icon: ClipboardList,
      },
      {
        href: "/dashboard/admin/categories",
        label: "Categories",
        icon: Tags,
      },
    ],
  };

  const dashboardItems = user ? dashboardNavConfig[user.role] : [];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/gear", label: "Browse Gear" },
    ...(isAuthenticated ? [{ href: dashboardPath, label: "Dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-30">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Dumbbell className="size-5" />
          </div>
          GearUp
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border bg-muted/50 p-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 rounded-full pr-4 pl-1.5"
                    >
                      <Avatar className="size-8 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <span className="hidden text-sm font-medium sm:inline">
                        {user.name}
                      </span>
                    </Button>
                  }
                />

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push(dashboardPath)}>
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="rounded-full"
                  nativeButton={false}
                  render={<Link href="/login">Login</Link>}
                />

                <Button
                  className="rounded-full"
                  nativeButton={false}
                  render={<Link href="/register">Register</Link>}
                />
              </>
            )}
          </div>

          {/* Mobile Avatar */}
          {isAuthenticated && user && (
            <Avatar className="size-8 ring-2 ring-primary/20 md:hidden">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            {/* Main Navigation */}
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label === "Dashboard" ? (
                  <LayoutDashboard className="size-4" />
                ) : (
                  <span className="size-4" />
                )}

                {link.label}
              </Link>
            ))}

            {/* Dashboard Navigation */}
            {isAuthenticated && user && dashboardItems.length > 0 && (
              <>
                <div className="my-3 border-t border-border/60" />

                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {user.role === "ADMIN"
                    ? "Admin Panel"
                    : user.role === "PROVIDER"
                      ? "Provider Panel"
                      : "My Account"}
                </p>

                {dashboardItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}

            {/* Auth section */}
            <div className="my-3 border-t border-border/60" />

            {isAuthenticated && user ? (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl px-3 py-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 size-4" />
                Logout
              </Button>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant="ghost"
                  className="w-full rounded-full"
                  nativeButton={false}
                  render={
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                  }
                />

                <Button
                  className="w-full rounded-full"
                  nativeButton={false}
                  render={
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  }
                />
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
