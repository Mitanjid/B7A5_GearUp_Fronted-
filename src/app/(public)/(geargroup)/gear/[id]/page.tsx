import { GearDetailsView } from "../../_components/gear-details-view";

interface GearDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GearDetailsPage({
  params,
}: GearDetailsPageProps) {
  const { id } = await params;

  return <GearDetailsView gearId={id} />;
}
