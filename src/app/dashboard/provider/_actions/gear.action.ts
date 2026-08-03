import { apiClient } from "@/lib/api-client";

interface CreateGearPayload {
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
}

export async function createGear(payload: CreateGearPayload, token: string) {
  return apiClient.post("/api/gear/provider", payload, token);
}
