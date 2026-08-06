import { DashboardLayout } from "@/components/shared/dashboard-sidebar/dashboard-layout";
import { RoleGuard } from "@/components/shared/role-guard";


export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRole="CUSTOMER">
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
