"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGearByIdProvider, deleteGear } from "../_actions/gear.action";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { AlertCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EditGearForm } from "./edit-gear-form";

export function GearManager({ gearId }: { gearId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["provider-gear", gearId],
    queryFn: () => getGearByIdProvider(gearId, accessToken!),
    enabled: !!accessToken,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGear(gearId, accessToken!);
      toast.success("Gear deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-gear"] });
      router.push("/dashboard/provider/gear");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete gear");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Failed to load gear</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Gear not found."}
        </AlertDescription>
      </Alert>
    );
  }

  const gear = data.data;

  if (isEditing) {
    return (
      <div className="max-w-lg">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit Gear</h1>
        <EditGearForm
          gearId={gearId}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {gear.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-xl border">
          <Image
            src={gear.imageUrl}
            alt={gear.name}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="rounded-lg object-contain"
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{gear.name}</h1>
          {gear.brand && (
            <p className="text-sm text-muted-foreground">{gear.brand}</p>
          )}
        </div>
        <Badge variant={gear.isAvailable ? "default" : "destructive"}>
          {gear.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>

      {gear.description && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {gear.description}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 rounded-xl border p-4 text-sm">
        <div>
          <p className="text-muted-foreground">Category</p>
          <p className="font-medium">{gear.category?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Price / Day</p>
          <p className="font-medium">${gear.pricePerDay}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Stock</p>
          <p className="font-medium">{gear.stock}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="gap-2" onClick={() => setIsEditing(true)}>
          <Pencil className="size-4" />
          Update
        </Button>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" className="gap-2">
                <Trash2 className="size-4" />
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
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
