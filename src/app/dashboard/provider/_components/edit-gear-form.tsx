"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { gearFormSchema, type GearFormValues } from "./gear-form-schema";
import { getGearByIdProvider, updateGear } from "../_actions/gear.action";

import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getAllCategories } from "@/app/(public)/(geargroup)/_action/category.action";

interface EditGearFormProps {
  gearId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditGearForm({
  gearId,
  onSuccess,
  onCancel,
}: EditGearFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // null মানে user এখনো toggle করেনি — তখন fetched data থেকে value নেওয়া হবে
  const [isAvailableOverride, setIsAvailableOverride] = useState<
    boolean | null
  >(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const { data: gearData, isLoading: isGearLoading } = useQuery({
    queryKey: ["provider-gear", gearId],
    queryFn: () => getGearByIdProvider(gearId, accessToken!),
    enabled: !!accessToken,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });

  const categories = categoriesData?.data ?? [];

  // effect ছাড়াই derive করা — no cascading setState
  const isAvailable =
    isAvailableOverride ?? gearData?.data?.isAvailable ?? true;

  const form = useForm<GearFormValues>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      pricePerDay: 0,
      stock: 1,
      categoryId: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (gearData?.data) {
      const g = gearData.data;
      form.reset({
        name: g.name,
        description: g.description ?? "",
        brand: g.brand ?? "",
        pricePerDay: Number(g.pricePerDay),
        stock: g.stock,
        categoryId: g.categoryId,
        imageUrl: "",
      });
    }
  }, [gearData, form]);

  const onSubmit = async (values: GearFormValues) => {
    setIsLoading(true);
    try {
      await updateGear(
        gearId,
        {
          ...values,
          imageUrl: values.imageUrl || undefined,
          isAvailable,
        } as never,
        accessToken!,
      );

      await queryClient.invalidateQueries({ queryKey: ["my-gear"] });
      await queryClient.invalidateQueries({
        queryKey: ["provider-gear", gearId],
      });

      toast.success("Gear updated successfully!");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/provider/gear");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update gear",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isGearLoading) return <Skeleton className="h-96 w-full max-w-lg" />;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Gear Name</FieldLabel>
            <Input {...field} id={field.name} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Textarea {...field} id={field.name} />
          </Field>
        )}
      />

      <Controller
        name="brand"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Brand</FieldLabel>
            <Input {...field} id={field.name} />
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="pricePerDay"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Price / Day ($)</FieldLabel>
              <Input
                id={field.name}
                type="number"
                step="0.01"
                value={field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                onBlur={field.onBlur}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="stock"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
              <Input
                id={field.name}
                type="number"
                value={field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                onBlur={field.onBlur}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="categoryId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Category</FieldLabel>
            <Select
              items={categories.map((c) => ({ label: c.name, value: c.id }))}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full" id={field.name}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field className="flex flex-row items-center justify-between rounded-xl border p-4">
        <FieldLabel htmlFor="availability">Available for Rent</FieldLabel>
        <Switch
          id="availability"
          checked={isAvailable}
          onCheckedChange={setIsAvailableOverride}
        />
      </Field>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-full"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-full"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
