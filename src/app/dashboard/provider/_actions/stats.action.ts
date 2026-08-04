import { apiClient } from "@/lib/api-client";
import { getMyGear } from "./gear.action";

export async function getProviderStats(token: string) {
  const gearRes = await getMyGear(token);
  const ordersRes = await apiClient.get<{ data: { status: string }[] }>(
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

  return { totalGear, activeRentals, pendingOrders };
}
