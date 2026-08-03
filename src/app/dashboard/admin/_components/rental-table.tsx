"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllRentalsAdmin } from "../_action/admin.action";
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

export function RentalTable() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => getAllRentalsAdmin(accessToken!),
    enabled: !!accessToken,
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const rentals = data?.data ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rentals.map((rental) => (
          <TableRow key={rental.id}>
            <TableCell>{rental.gearItem.name}</TableCell>
            <TableCell>{rental.customer.name}</TableCell>
            <TableCell>
              {new Date(rental.startDate).toLocaleDateString()} -{" "}
              {new Date(rental.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell>${rental.totalAmount}</TableCell>
            <TableCell>
              <Badge variant="secondary">{rental.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
