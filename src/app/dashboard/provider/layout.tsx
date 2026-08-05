import { DashboardLayout } from "@/components/shared/dashboard-sidebar/dashboard-layout";
import { RoleGuard } from "@/components/shared/role-guard";


export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRole="PROVIDER">
    <DashboardLayout>{children}</DashboardLayout>;
  </RoleGuard>;
}
