import { apiClient } from "@/lib/api-client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

interface UserListResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
}

export interface AdminGearItem {
  id: string;
  name: string;
  pricePerDay: string;
  stock: number;
  isAvailable: boolean;
  category: { name: string };
  provider: { name: string; email: string };
}

interface GearListResponse {
  success: boolean;
  message: string;
  data: AdminGearItem[];
}

export interface AdminRentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  status: string;
  gearItem: { name: string };
  customer: { name: string; email: string };
}

interface RentalListResponse {
  success: boolean;
  message: string;
  data: AdminRentalOrder[];
}

export async function getAllUsers(token: string) {
  return apiClient.get<UserListResponse>("/api/admin/users", token);
}

export async function updateUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED",
  token: string,
) {
  return apiClient.patch(`/api/admin/users/${id}`, { status }, token);
}

export async function getAllGearAdmin(token: string) {
  return apiClient.get<GearListResponse>("/api/admin/gear", token);
}

export async function getAllRentalsAdmin(token: string) {
  return apiClient.get<RentalListResponse>("/api/admin/rentals", token);
}
