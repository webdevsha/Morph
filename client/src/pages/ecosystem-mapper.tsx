import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, BookOpen, Users, GraduationCap } from "lucide-react";
import { useState } from "react";
import type { Pathway } from "@shared/schema";

type EcosystemNodeProps = {
  title: string;
  description: string;
  type: 'pathway' | 'resource' | 'organization';
  status?: 'completed' | 'active' | 'locked';
  links?: Array<{ title: string; url: string; type: string }>;
  onClick?: () => void;
};

const EcosystemNode = ({ 
  title, 
  description, 
  type,
  status = 'active',
  links,
  onClick 
}: EcosystemNodeProps) => (
  <Card 
    className={`
      p-4 border-2 transition-all relative
      ${status === 'completed' ? 'border-green-500 bg-green-50/50' : ''}
      ${status === 'active' ? 'border-primary' : ''}
      ${status === 'locked' ? 'border-gray-200 opacity-50' : ''}
      hover:shadow-md
    `}
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold">{title}</h3>
      <Badge variant={type === 'pathway' ? 'default' : 'secondary'}>
        {type}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>

    {links && links.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Connected Resources:</h4>
        <div className="grid gap-2">
          {links.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-2"
            >
              {link.type === 'organization' && <Users className="h-4 w-4" />}
              {link.type === 'resource' && <BookOpen className="h-4 w-4" />}
              {link.type === 'standards' && <GraduationCap className="h-4 w-4" />}
              {link.title}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    )}
  </Card>
);

const ConnectorLine = () => (
  <div className="w-px h-8 bg-primary/30 mx-auto" />
);

export default function EcosystemMapper() {
  const selectedPersona = localStorage.getItem('selectedPersona') || 'learner';
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const { data: pathways, isLoading } = useQuery<Pathway[]>({
    queryKey: ["/api/pathways"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const filteredPathways = pathways?.filter(p => p.persona === selectedPersona);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">AI Safety Ecosystem Map</h1>
            <p className="text-muted-foreground mt-2">
              Explore the interconnected landscape of AI safety knowledge and resources
            </p>
          </div>

          <Tabs defaultValue="pathways" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pathways">Learning Pathways</TabsTrigger>
              <TabsTrigger value="network">Network View</TabsTrigger>
            </TabsList>

            <TabsContent value="pathways">
              <div className="space-y-8">
                {filteredPathways?.map((pathway) => (
                  <section key={pathway.id} className="space-y-4">
                    <EcosystemNode
                      title={pathway.title}
                      description={pathway.description}
                      type="pathway"
                      status={activeNode === pathway.id ? 'active' : undefined}
                      links={pathway.ecosystem_links as any}
                      onClick={() => setActiveNode(pathway.id)}
                    />
                    <ConnectorLine />
                    <div className="grid md:grid-cols-2 gap-4">
                      {pathway.resources?.map((resource: any, index: number) => (
                        <EcosystemNode
                          key={index}
                          title={resource.title}
                          description={`${resource.type} by ${resource.provider}`}
                          type="resource"
                          links={[{ 
                            title: "View Resource",
                            url: resource.url,
                            type: "resource"
                          }]}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="network">
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Network Visualization Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    An interactive network view of the AI safety ecosystem will be available here
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}