import { PayView } from "./_components/pay-view";

interface PayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { id } = await params;
  return <PayView rentalOrderId={id} />;
}
