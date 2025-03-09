import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { PathwayVisualization } from "@/components/pathway-visualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Pathway } from "@shared/schema";

export default function EcosystemMapper() {
  const { data: pathways, isLoading } = useQuery<Pathway[]>({
    queryKey: ["/api/pathways"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Safety Ecosystem Mapper</h1>
          <p className="text-muted-foreground mt-2">
            Explore different pathways in AI safety education
          </p>
        </div>

        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="topic">Topic View</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <Card className="p-6">
              {pathways && <PathwayVisualization pathways={pathways} viewType="timeline" />}
            </Card>
          </TabsContent>

          <TabsContent value="topic" className="mt-6">
            <Card className="p-6">
              {pathways && <PathwayVisualization pathways={pathways} viewType="topic" />}
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Skills Overview</h3>
            <ul className="space-y-2">
              {pathways?.[0]?.outcomes?.map((outcome, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {outcome}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Prerequisites</h3>
            <ul className="space-y-2">
              {pathways?.[0]?.prerequisites?.map((prereq, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {prereq}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Resources</h3>
            <p className="text-sm text-muted-foreground">
              Access curated learning materials and tools to support your journey
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
