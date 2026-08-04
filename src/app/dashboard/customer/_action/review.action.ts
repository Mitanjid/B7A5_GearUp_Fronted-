import { apiClient } from "@/lib/api-client";

export async function createReview(
  payload: { rentalOrderId: string; rating: number; comment?: string },
  token: string,
) {
  return apiClient.post("/api/reviews", payload, token);
}
