import { apiClient } from "@/lib/api-client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export async function getAllCategories() {
  return apiClient.get<CategoryListResponse>("/api/categories");
}
