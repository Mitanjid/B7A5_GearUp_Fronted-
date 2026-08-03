import { apiClient } from "@/lib/api-client";

interface CreateRentalPayload {
  gearItemId: string;
  startDate: string;
  endDate: string;
}

export async function createRental(
  payload: CreateRentalPayload,
  token: string,
) {
  return apiClient.post("/api/rentals", payload, token);
}
