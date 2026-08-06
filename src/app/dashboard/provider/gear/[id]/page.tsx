import { BackButton } from "@/components/shared/back-button";
import { GearManager } from "../../_components/gear-manager";


interface GearPageProps {
  params: Promise<{ id: string }>;
}

export default async function GearPage({ params }: GearPageProps) {
  const { id } = await params;
  return (
    <div>
      <BackButton />
      <GearManager gearId={id} />
    </div>
  );
}
