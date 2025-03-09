import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import type { Tool as ToolType } from "@shared/schema";

export default function Tools() {
  const { data: tools } = useQuery<ToolType[]>({
    queryKey: ["/api/tools"],
  });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Safety Tools</h1>
          <p className="text-muted-foreground mt-2">
            Access specialized tools for AI safety education and assessment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools?.map((tool) => (
            <Card key={tool.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {tool.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {tool.type}
                </span>
                <Button size="sm">Launch Tool</Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-6 border-dashed">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Looking for More?</h3>
            <p className="text-sm text-muted-foreground">
              New tools are being added regularly to support your AI safety learning journey
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
