import { apiClient } from "@/lib/api-client";

export interface ProviderOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  status: string;
  gearItem: { name: string };
  customer: { name: string; email: string };
}

interface OrderListResponse {
  success: boolean;
  message: string;
  data: ProviderOrder[];
}

export async function getProviderOrders(token: string) {
  return apiClient.get<OrderListResponse>(
    "/api/rentals/provider/orders",
    token,
  );
}

export async function updateOrderStatus(
  id: string,
  status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED",
  token: string,
) {
  return apiClient.patch(`/api/rentals/provider/${id}`, { status }, token);
}
