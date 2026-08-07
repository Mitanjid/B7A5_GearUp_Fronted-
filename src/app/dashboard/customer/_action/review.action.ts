import { apiClient } from "@/lib/api-client";

export interface CreateReviewData {
  rentalOrderId: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  customer: {
    id: string;
    name: string;
  };
}

interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review[];
}

export async function createReview(data: CreateReviewData, token: string) {
  return apiClient.post("/api/reviews", data, token);
}

export async function getGearReviews(
  gearItemId: string,
): Promise<ReviewResponse> {
  return apiClient.get<ReviewResponse>(`/api/reviews/gear/${gearItemId}`);
}
