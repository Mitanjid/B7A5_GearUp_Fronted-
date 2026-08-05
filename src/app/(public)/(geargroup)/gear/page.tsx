"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GearCard } from "../_components/gear-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "../_action/category.action";
import { getAllGear } from "../_action/gear.action";

export default function GearBrowsePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gear", search, category, minPrice, maxPrice],
    queryFn: () =>
      getAllGear({
        searchTerm: search || undefined,
        category: category !== "all" ? category : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      }),
  });

  const categories = categoriesData?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">   
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Browse Gear</h1>

      <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border bg-muted/30 p-4 sm:grid-cols-4">
        <Input
          placeholder="Search gear..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          items={[
            { label: "All Categories", value: "all" },
            ...categories.map((c) => ({ label: c.name, value: c.id })),
          ]}
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Min price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          placeholder="Max price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-destructive">Failed to load gear.</p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-center text-muted-foreground">No gear found.</p>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      )}
    </div>
  );
}
