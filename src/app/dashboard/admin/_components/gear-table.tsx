"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllGearAdmin } from "../_action/admin.action";

export function GearTable() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-gear"],
    queryFn: () => getAllGearAdmin(accessToken!),
    enabled: !!accessToken,
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const gearList = data?.data ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Price/Day</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gearList.map((gear) => (
          <TableRow key={gear.id}>
            <TableCell>{gear.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{gear.category.name}</Badge>
            </TableCell>
            <TableCell>{gear.provider.name}</TableCell>
            <TableCell>${gear.pricePerDay}</TableCell>
            <TableCell>{gear.stock}</TableCell>
            <TableCell>
              <Badge variant={gear.isAvailable ? "default" : "destructive"}>
                {gear.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
