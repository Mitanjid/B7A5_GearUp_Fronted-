"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Tent,
  Bike,
  Waves,
  Snowflake,
  Camera,
  Mountain,
  Package,
  type LucideIcon,
} from "lucide-react";
import { getAllCategories } from "@/app/(public)/(geargroup)/_action/category.action";
import { Skeleton } from "@/components/ui/skeleton";

const iconRules: [string[], LucideIcon][] = [
  [["camp"], Tent],
  [["bike", "cycl"], Bike],
  [["water", "kayak", "surf", "paddle"], Waves],
  [["ski", "snow", "winter"], Snowflake],
  [["camera", "photo"], Camera],
  [["hike", "hik", "trek", "mountain"], Mountain],
];

function iconFor(name: string): LucideIcon {
  const lower = name.toLowerCase();
  const match = iconRules.find(([keywords]) =>
    keywords.some((k) => lower.includes(k)),
  );
  return match ? match[1] : Package;
}

export function CategoryStrip() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });

  const categories = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-hidden px-4 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="border-b border-border/40 bg-muted/20">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-4 scrollbar-width:none [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const Icon = iconFor(cat.name);
          return (
            <Link
              key={cat.id}
              href={`/gear?category=${cat.id}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted"
            >
              <Icon className="size-4 text-muted-foreground" />
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
