"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategoriesAdmin,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../_action/category.action";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function CategoryManager() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
const [editingId, setEditingId] = useState<string | null>(null);
const [editingName, setEditingName] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => getAllCategoriesAdmin(),
  });

  const categories = data?.data ?? [];

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await createCategory({ name }, accessToken!);
      toast.success("Category created");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      await deleteCategory(id, accessToken!);
      toast.success("Category deleted");
      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    } finally {
      setDeletingId(null);
    }
  };
  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await updateCategory(
        editingId,
        {
          name: editingName,
        },
        accessToken!,
      );

      toast.success("Category updated");

      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
      });

      setEditingId(null);
      setEditingName("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category",
      );
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
        />
        <Button onClick={handleCreate} disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              {editingId === cat.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="mr-3"
                />
              ) : (
                <span className="font-medium">{cat.name}</span>
              )}

              <div className="flex gap-2">
                {editingId === cat.id ? (
                  <>
                    <Button size="sm" onClick={handleUpdate}>
                      Save
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === cat.id}
                      onClick={() => handleDelete(cat.id)}
                    >
                      {deletingId === cat.id ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
