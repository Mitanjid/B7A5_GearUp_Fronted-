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

export interface ProviderGearItem {
  id: string;
  name: string;
  pricePerDay: string;
  stock: number;
  isAvailable: boolean;
  imageUrl: string | null;
  category: { name: string };
}

interface ProviderGearListResponse {
  success: boolean;
  message: string;
  data: ProviderGearItem[];
}

export async function createGear(payload: CreateGearPayload, token: string) {
  return apiClient.post("/api/gear/provider", payload, token);
}

export async function getMyGear(token: string) {
  return apiClient.get<ProviderGearListResponse>(
    "/api/gear/provider/my-gear",
    token,
  );
}

export async function deleteGear(id: string, token: string) {
  return apiClient.delete(`/api/gear/provider/${id}`, token);
}
