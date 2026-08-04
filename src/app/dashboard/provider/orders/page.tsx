import { BackButton } from "@/components/shared/back-button";
import { OrderTable } from "../_components/order-table";


export default function ProviderOrdersPage() {
  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">Manage Orders</h1>
      <OrderTable />
    </div>
  );
}
