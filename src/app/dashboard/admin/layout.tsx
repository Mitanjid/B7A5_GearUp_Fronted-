import { RoleGuard } from "@/components/shared/role-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRole="ADMIN">{children}</RoleGuard>;
}
