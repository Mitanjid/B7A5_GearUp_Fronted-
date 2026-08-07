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
import { Input } from "@/components/ui/input";

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
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const usersPerPage = 5;

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
        `User ${
          newStatus === "ACTIVE" ? "activated" : "suspended"
        } successfully`,
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      setOpenDialogId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user",
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  const users = data?.data ?? [];

  // Search
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (page - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {/* User Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                {/* Name */}
                <TableCell className="font-medium">{user.name}</TableCell>

                {/* Email */}
                <TableCell>{user.email}</TableCell>

                {/* Role */}
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={
                      user.status === "ACTIVE" ? "default" : "destructive"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>

                {/* Created */}
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <AlertDialog
                    open={openDialogId === user.id}
                    onOpenChange={(open) =>
                      setOpenDialogId(open ? user.id : null)
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
                        <AlertDialogTitle>Confirm Action</AlertDialogTitle>

                        <AlertDialogDescription>
                          Are you sure you want to{" "}
                          {user.status === "ACTIVE" ? "suspend" : "activate"}{" "}
                          <strong>{user.name}</strong>
                          &apos;s account?
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
