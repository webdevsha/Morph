import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ReactNode } from "react";

export function PathwayLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
