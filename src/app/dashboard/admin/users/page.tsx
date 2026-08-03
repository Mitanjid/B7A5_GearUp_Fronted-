import { BackButton } from "@/components/shared/back-button";
import { UserTable } from "../_components/user-table";

export default function AdminUsersPage() {
  return (
    <div>
      <BackButton />
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <UserTable />
    </div>
  );
}
