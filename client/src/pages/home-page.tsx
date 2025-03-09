import { useAuth } from "@/hooks/use-auth";
import { PersonaSelector } from "@/components/persona-selector";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ProgressChart } from "@/components/progress-chart";

export default function HomePage() {
  const { user } = useAuth();

  if (!user?.persona) {
    return <PersonaSelector />;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <ProgressChart progress={user.progress} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {/* Recent activity content */}
          </section>
        </div>
      </main>
    </div>
  );
}
