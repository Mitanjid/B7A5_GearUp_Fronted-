"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getProviderOrders, updateOrderStatus } from "../_actions/order.action";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const nextStatusMap: Record<string, { next: string; label: string } | undefined> = {
  PLACED: { next: "CONFIRMED", label: "Confirm" },
  PAID: { next: "PICKED_UP", label: "Mark Picked Up" },
  PICKED_UP: { next: "RETURNED", label: "Mark Returned" },
};

const statusColors: Record<string, string> = {
  PLACED: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-purple-100 text-purple-800",
  PICKED_UP: "bg-green-100 text-green-800",
  RETURNED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function OrderTable() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => getProviderOrders(accessToken!),
    enabled: !!accessToken,
    refetchInterval: 15000,
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      await updateOrderStatus(id, newStatus as "CONFIRMED", accessToken!);
      toast.success(`Order marked as ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update order");
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const orders = data?.data ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const action = nextStatusMap[order.status];
          return (
            <TableRow key={order.id}>
              <TableCell>{order.gearItem.name}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>
                {new Date(order.startDate).toLocaleDateString()} -{" "}
                {new Date(order.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                {action && (
                  <Button
                    size="sm"
                    disabled={loadingId === order.id}
                    onClick={() => handleUpdateStatus(order.id, action.next)}
                  >
                    {loadingId === order.id ? "Updating..." : action.label}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}