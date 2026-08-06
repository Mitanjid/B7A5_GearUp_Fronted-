import { apiClient } from "@/lib/api-client";

interface CheckoutResponse {
  success: boolean;
  message: string;
  data: { checkoutUrl: string; sessionId: string };
}

export async function createPaymentSession(
  rentalOrderId: string,
  token: string,
) {
  return apiClient.post<CheckoutResponse>(
    "/api/payments/create",
    { rentalOrderId },
    token,
  );
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  amount: string;
  method: string;
  status: string;
  paidAt: string | null;
  rentalOrder: { gearItem: { name: string } };
}

interface PaymentListResponse {
  success: boolean;
  message: string;
  data: PaymentRecord[];
}

export async function getPaymentHistory(token: string) {
  return apiClient.get<PaymentListResponse>("/api/payments", token);
}