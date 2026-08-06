"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaymentHistory } from "../_action/payment.action";

export default function PaymentHistoryPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ["payment-history"],
    queryFn: () => getPaymentHistory(accessToken!),
    enabled: !!accessToken,
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const payments = data?.data ?? [];

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold tracking-tight">
        Payment History
      </h1>
      <p className="mb-6 text-muted-foreground">All your past transactions</p>

      {payments.length === 0 ? (
        <p className="text-muted-foreground">No payments yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.rentalOrder.gearItem.name}</TableCell>
                <TableCell>${p.amount}</TableCell>
                <TableCell>{p.method}</TableCell>
                <TableCell>
                  <Badge
                    variant={p.status === "COMPLETED" ? "default" : "secondary"}
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
