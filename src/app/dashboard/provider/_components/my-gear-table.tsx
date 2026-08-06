"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getMyGear, deleteGear } from "../_actions/gear.action";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

export function MyGearTable() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-gear"],
    queryFn: () => getMyGear(accessToken!),
    enabled: !!accessToken,
  });

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await deleteGear(id, accessToken!);
      toast.success("Gear deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-gear"] });
      setOpenDialogId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete gear",
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const gearList = data?.data ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price/Day</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gearList.map((gear) => (
          <TableRow key={gear.id}>
            <TableCell>{gear.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{gear.category.name}</Badge>
            </TableCell>
            <TableCell>${gear.pricePerDay}</TableCell>
            <TableCell>{gear.stock}</TableCell>
            <TableCell>
              <Badge variant={gear.isAvailable ? "default" : "destructive"}>
                {gear.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={
                  <Link href={`/dashboard/provider/gear/${gear.id}`}>View</Link>
                }
              />

              <AlertDialog
                open={openDialogId === gear.id}
                onOpenChange={(isOpen) =>
                  setOpenDialogId(isOpen ? gear.id : null)
                }
              >
                <AlertDialogTrigger
                  render={
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete &quot;{gear.name}&quot;.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(gear.id)}
                      disabled={loadingId === gear.id}
                    >
                      {loadingId === gear.id ? "Deleting..." : "Delete"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
