import { z } from "zod";

export const gearFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  brand: z.string().optional(),
  pricePerDay: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string({ error: "Please select a category" }),
  imageUrl: z.union([z.url("Invalid URL"), z.literal("")]).optional(),
});

export type GearFormValues = z.infer<typeof gearFormSchema>;
