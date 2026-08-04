import { BackButton } from "@/components/shared/back-button";
import { MyGearTable } from "../_components/my-gear-table";

export default function MyGearPage() {
  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">My Gear</h1>
      <MyGearTable />
    </div>
  );
}
