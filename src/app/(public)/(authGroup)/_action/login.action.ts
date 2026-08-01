import { apiClient } from "@/lib/api-client";
import type { LoginFormValues } from "@/lib/validations/auth.validation";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    };
  };
}

export async function loginUser(values: LoginFormValues) {
  return apiClient.post<LoginResponse>("/api/auth/login", values);
}
