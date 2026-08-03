import { BackButton } from "@/components/shared/back-button";
import { GearTable } from "../_components/gear-table";

export default function AdminGearPage() {
  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">All Gear Listings</h1>
      <GearTable />
    </div>
  );
}
