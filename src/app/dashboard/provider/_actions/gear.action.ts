import { apiClient } from "@/lib/api-client";
import { z } from "zod";

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
  imageUrl: string | null;
  category: { name: string };
  isAvailable: boolean;
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
export async function getGearByIdProvider(id: string, token: string) {
  return apiClient.get<{
    success: boolean;
    message: string;
    data: ProviderGearItem & {
      description: string | null;
      brand: string | null;
      categoryId: string;
    };
  }>(`/api/gear/${id}`, token);
}

export async function updateGear(
  id: string,
  payload: Partial<CreateGearPayload>,
  token: string,
) {
  return apiClient.patch(`/api/gear/provider/${id}`, payload, token);
}
