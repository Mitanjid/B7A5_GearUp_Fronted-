import { apiClient } from "@/lib/api-client";

interface CreateRentalPayload {
  gearItemId: string;
  startDate: string;
  endDate: string;
}

export interface RentalReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface RentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  status:
    | "PLACED"
    | "CONFIRMED"
    | "PAID"
    | "PICKED_UP"
    | "RETURNED"
    | "CANCELLED";
  gearItem: {
    id: string;
    name: string;
    imageUrl: string | null;
    pricePerDay: string;
    provider: { name: string };
  };
  review: RentalReview | null; // 👈 নতুন field
}

interface RentalListResponse {
  success: boolean;
  message: string;
  data: RentalOrder[];
}

export async function createRental(
  payload: CreateRentalPayload,
  token: string,
) {
  return apiClient.post("/api/rentals", payload, token);
}

export async function getCustomerRentals(token: string) {
  return apiClient.get<RentalListResponse>("/api/rentals", token);
}
