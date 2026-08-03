import { BackButton } from "@/components/shared/back-button";
import { GearForm } from "../../_components/gear-form";

export default function NewGearPage() {
  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">Add New Gear</h1>
      <GearForm />
    </div>
  );
}
