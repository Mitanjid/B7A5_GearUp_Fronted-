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
import { getAllBrands, getAllGear } from "../_action/gear.action";
import { getAllCategories } from "../_action/category.action";

export default function GearBrowsePage() {
  // =========================
  // Filter States
  // =========================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  const limit = 6;

  // =========================
  // Categories
  // =========================

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const categories = categoriesData?.data ?? [];

  // =========================
  // Brands
  // =========================

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const brands = brandsData?.data ?? [];

  // =========================
  // Gear
  // =========================

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gear", search, category, brand, minPrice, maxPrice, page],

    queryFn: () =>
      getAllGear({
        searchTerm: search || undefined,

        category: category !== "all" ? category : undefined,

        brand: brand !== "all" ? brand : undefined,

        minPrice: minPrice || undefined,

        maxPrice: maxPrice || undefined,

        page: String(page),

        limit: String(limit),
      }),
  });

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Browse Gear</h1>

        {/* Filter Skeleton */}

        <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Gear Skeleton */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-center text-destructive">Failed to load gear.</p>
      </div>
    );
  }

  // =========================
  // Data
  // =========================

  const gearList = data?.data?.data ?? [];

  const meta = data?.data?.meta;

  // =========================
  // Main UI
  // =========================

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* =========================
          Page Title
      ========================= */}

      <h1 className="mb-6 text-3xl font-bold">Browse Gear</h1>

      {/* =========================
          Filters
      ========================= */}

      <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* =========================
            Search
        ========================= */}

        <Input
          placeholder="Search gear..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* =========================
            Category
        ========================= */}

        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category">
              {category === "all"
                ? "All Categories"
                : categories.find((c) => c.id === category)?.name}
            </SelectValue>
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

        {/* =========================
            Brand
        ========================= */}

        <Select
          value={brand}
          onValueChange={(value) => {
            setBrand(value ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Brand">
              {brand === "all" ? "All Brands" : brand}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>

            {brands.map((brandName) => (
              <SelectItem key={brandName} value={brandName}>
                {brandName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* =========================
            Min Price
        ========================= */}

        <Input
          placeholder="Min price"
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setPage(1);
          }}
        />

        {/* =========================
            Max Price
        ========================= */}

        <Input
          placeholder="Max price"
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* =========================
          Gear Count
      ========================= */}

      {meta && (
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {gearList.length} of {meta.total} gear items
        </div>
      )}

      {/* =========================
          No Gear
      ========================= */}

      {gearList.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No gear found.</p>
        </div>
      )}

      {/* =========================
          Gear Grid
      ========================= */}

      {gearList.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gearList.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      )}

      {/* =========================
          Pagination
      ========================= */}

      {meta && meta.totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {/* Previous */}

          <button
            type="button"
            onClick={() => {
              setPage((prev) => Math.max(prev - 1, 1));

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            disabled={page === 1}
            className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Numbers */}

          <div className="flex items-center gap-2">
            {Array.from(
              {
                length: meta.totalPages,
              },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => {
                  setPage(pageNumber);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className={`size-9 rounded-lg border text-sm transition ${
                  page === pageNumber
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {/* Next */}

          <button
            type="button"
            onClick={() => {
              setPage((prev) => Math.min(prev + 1, meta.totalPages));

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            disabled={page === meta.totalPages}
            className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
