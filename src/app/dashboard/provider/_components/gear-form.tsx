"use client";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { gearFormSchema, type GearFormValues } from "./gear-form-schema";
import { createGear } from "../_actions/gear.action";
import { getAllCategories } from "@/app/(public)/(geargroup)/_action/category.action";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function GearForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });

  const categories = categoriesData?.data ?? [];

  const form = useForm<z.input<typeof gearFormSchema>>({
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

  const onSubmit = async (values: GearFormValues) => {
    setIsLoading(true);
    try {
      await createGear(
        { ...values, imageUrl: values.imageUrl || undefined },
        accessToken!,
      );
      toast.success("Gear added successfully!");
      router.push("/dashboard/provider/gear");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add gear",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Gear Name</FieldLabel>
            <Input {...field} id={field.name} placeholder="Mountain Bike" />
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
            <Textarea
              {...field}
              id={field.name}
              placeholder="Optional description"
            />
          </Field>
        )}
      />

      <Controller
        name="brand"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Brand</FieldLabel>
            <Input {...field} id={field.name} placeholder="Optional brand" />
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
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="imageUrl"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
            <Input {...field} id={field.name} placeholder="https://..." />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding Gear..." : "Add Gear"}
      </Button>
    </form>
  );
}
