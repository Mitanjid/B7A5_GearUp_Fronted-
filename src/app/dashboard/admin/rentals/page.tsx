import { BackButton } from "@/components/shared/back-button";
import { RentalTable } from "../_components/rental-table";

export default function AdminRentalsPage() {
  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">All Rental Orders</h1>
      <RentalTable />
    </div>
  );
}
