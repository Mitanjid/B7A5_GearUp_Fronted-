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

export async function getAllCategoriesAdmin() {
  return apiClient.get<CategoryListResponse>("/api/categories");
}

export async function createCategory(
  payload: { name: string; description?: string },
  token: string,
) {
  return apiClient.post("/api/categories", payload, token);
}

export async function deleteCategory(id: string, token: string) {
  return apiClient.delete(`/api/categories/${id}`, token);
}
export async function updateCategory(
  id: string,
  payload: {
    name: string;
    description?: string;
  },
  token: string,
) {
  return apiClient.patch(`/api/categories/${id}`, payload, token);
}