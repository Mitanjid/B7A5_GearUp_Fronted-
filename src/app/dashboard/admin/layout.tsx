import { DashboardLayout } from "@/components/shared/dashboard-sidebar/dashboard-layout";
import { RoleGuard } from "@/components/shared/role-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRole="ADMIN">
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
 
}
