import { apiClient } from "@/lib/api-client";
import type { RegisterFormValues } from "@/lib/validations/auth.validation";

export async function registerUser(values: RegisterFormValues) {
  return apiClient.post("/api/register", values);
}
