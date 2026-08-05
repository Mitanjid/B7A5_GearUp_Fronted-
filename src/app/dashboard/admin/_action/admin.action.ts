import { apiClient } from "@/lib/api-client";
import { getAllCategoriesAdmin } from "./category.action";

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

export interface ActivityItem {
  id: string;
  type: "user" | "rental";
  message: string;
  timestamp: string;
}

function buildRecentActivity(
  users: AdminUser[],
  rentals: AdminRentalOrder[],
): ActivityItem[] {
  const userEvents: ActivityItem[] = users.map((u) => ({
    id: `user-${u.id}`,
    type: "user",
    message: `${u.name} registered as ${u.role.charAt(0)}${u.role.slice(1).toLowerCase()}`,
    timestamp: u.createdAt,
  }));

  const rentalEvents: ActivityItem[] = rentals.map((r) => ({
    id: `rental-${r.id}`,
    type: "rental",
    message: `${r.customer.name} rented ${r.gearItem.name} — ${r.status.replace("_", " ").toLowerCase()}`,
    timestamp: r.startDate,
  }));

  return [...userEvents, ...rentalEvents]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 6);
}

export interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalGear: number;
  activeGear: number;
  totalRentals: number;
  pendingRentals: number;
  totalCategories: number;
  recentActivity: ActivityItem[];
}

export async function getAdminStats(token: string): Promise<AdminStats> {
  const [usersRes, gearRes, rentalsRes, categoriesRes] = await Promise.all([
    getAllUsers(token),
    getAllGearAdmin(token),
    getAllRentalsAdmin(token),
    getAllCategoriesAdmin(),
  ]);

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newUsersThisWeek = usersRes.data.filter(
    (u) => new Date(u.createdAt).getTime() >= oneWeekAgo,
  ).length;

  const activeGear = gearRes.data.filter((g) => g.isAvailable).length;
  const pendingRentals = rentalsRes.data.filter(
    (r) => r.status === "PLACED",
  ).length;

  return {
    totalUsers: usersRes.data.length,
    newUsersThisWeek,
    totalGear: gearRes.data.length,
    activeGear,
    totalRentals: rentalsRes.data.length,
    pendingRentals,
    totalCategories: categoriesRes.data.length,
    recentActivity: buildRecentActivity(usersRes.data, rentalsRes.data),
  };
}
