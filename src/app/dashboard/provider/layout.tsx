import { RoleGuard } from "@/components/shared/role-guard";


export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRole="PROVIDER">{children}</RoleGuard>;
}
