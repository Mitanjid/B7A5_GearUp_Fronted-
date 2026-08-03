import { apiClient } from "@/lib/api-client";

export interface GearItem {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  pricePerDay: string;
  stock: number;
  isAvailable: boolean;
  imageUrl: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
  };
}

interface GearListResponse {
  success: boolean;
  message: string;
  data: GearItem[];
}

export interface GearFilters {
  searchTerm?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}

export async function getAllGear(filters: GearFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const queryString = params.toString();
  const endpoint = queryString ? `/api/gear?${queryString}` : "/api/gear";

  return apiClient.get<GearListResponse>(endpoint);
}

export async function getGearById(id: string) {
  return apiClient.get<{ success: boolean; message: string; data: GearItem }>(
    `/api/gear/${id}`,
  );
}
