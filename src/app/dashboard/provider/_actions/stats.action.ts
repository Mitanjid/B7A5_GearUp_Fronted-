import { apiClient } from "@/lib/api-client";
import { getMyGear } from "./gear.action";

interface ProviderOrder {
  status: string;
  payments: {
    status: "PENDING" | "COMPLETED" | "FAILED";
    amount: string;
  }[];
}

export async function getProviderStats(token: string) {
  const gearRes = await getMyGear(token);
  const ordersRes = await apiClient.get<{ data: ProviderOrder[] }>(
    "/api/rentals/provider/orders",
    token,
  );

  const totalGear = gearRes.data.length;

  const activeRentals = ordersRes.data.filter((o) =>
    ["CONFIRMED", "PAID", "PICKED_UP"].includes(o.status),
  ).length;

  const pendingOrders = ordersRes.data.filter(
    (o) => o.status === "PLACED",
  ).length;

  const totalEarnings = ordersRes.data.reduce((sum, order) => {
    const completedAmount = order.payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((s, p) => s + Number(p.amount), 0);
    return sum + completedAmount;
  }, 0);

  return { totalGear, activeRentals, pendingOrders, totalEarnings };
}
