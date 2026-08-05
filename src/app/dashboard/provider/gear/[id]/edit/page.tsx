import { EditGearForm } from "../../../_components/edit-gear-form";

interface EditGearPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGearPage({ params }: EditGearPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold tracking-tight">Edit Gear</h1>
      <p className="mb-6 text-muted-foreground">Update your listing details</p>
      <EditGearForm gearId={id} />
    </div>
  );
}
