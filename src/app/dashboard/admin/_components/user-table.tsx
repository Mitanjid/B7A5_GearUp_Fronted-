"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getAllUsers,
  updateUserStatus,
  type AdminUser,
} from "../_action/admin.action";
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

export function UserTable() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAllUsers(accessToken!),
    enabled: !!accessToken,
  });

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setLoadingId(user.id);
    try {
      await updateUserStatus(user.id, newStatus, accessToken!);
      toast.success(
        `User ${newStatus === "SUSPENDED" ? "suspended" : "activated"}`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setOpenDialogId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const users = data?.data ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>createdAt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={user.status === "ACTIVE" ? "default" : "destructive"}
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <AlertDialog
                open={openDialogId === user.id}
                onOpenChange={(isOpen) =>
                  setOpenDialogId(isOpen ? user.id : null)
                }
              >
                <AlertDialogTrigger
                  render={
                    <Button
                      size="sm"
                      variant={
                        user.status === "ACTIVE" ? "destructive" : "default"
                      }
                      disabled={loadingId === user.id}
                    >
                      {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will{" "}
                      {user.status === "ACTIVE" ? "suspend" : "activate"}{" "}
                      {user.name}&apos;s account.
                      <br />
                      User ID: {user.id}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      onClick={() => handleToggleStatus(user)}
                      disabled={loadingId === user.id}
                    >
                      {loadingId === user.id ? "Please wait..." : "Confirm"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
