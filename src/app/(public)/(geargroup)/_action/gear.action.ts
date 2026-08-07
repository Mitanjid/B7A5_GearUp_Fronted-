import { apiClient } from "@/lib/api-client";

// =================================
// GEAR TYPE
// =================================

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

// =================================
// PAGINATION RESPONSE
// =================================

export interface GearMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GearListResponse {
  success: boolean;
  message: string;

  data: {
    data: GearItem[];
    meta: GearMeta;
  };
}

// =================================
// FILTERS
// =================================

export interface GearFilters {
  searchTerm?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
  page?: string;
  limit?: string;
}

// =================================
// GET ALL GEAR
// =================================

export async function getAllGear(filters: GearFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();

  const endpoint = queryString ? `/api/gear?${queryString}` : "/api/gear";

  return apiClient.get<GearListResponse>(endpoint);
}

// =================================
// GET ALL BRANDS
// =================================

export interface BrandsResponse {
  success: boolean;
  message: string;
  data: string[];
}

export async function getAllBrands() {
  return apiClient.get<BrandsResponse>("/api/gear/brands");
}

// =================================
// GET GEAR BY ID
// =================================

export async function getGearById(id: string) {
  return apiClient.get<{
    success: boolean;
    message: string;
    data: GearItem;
  }>(`/api/gear/${id}`);
}
