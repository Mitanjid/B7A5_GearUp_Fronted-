import { DashboardSidebar } from "@/components/shared/dashboard-sidebar/dashboard-sidebar";


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <div className="flex-1">
        
        <div className="mx-auto max-w-auto px-4 py-8">{children}</div>
      </div>
    </div>
  );
}
