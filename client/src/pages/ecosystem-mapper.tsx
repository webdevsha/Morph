import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, BookOpen, Users, GraduationCap, Globe } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Pathway } from "@shared/schema";

type EcosystemNodeProps = {
  title: string;
  description: string;
  type: 'pathway' | 'resource' | 'organization';
  status?: 'completed' | 'active' | 'locked';
  links?: Array<{ title: string; url: string; type: string }>;
  onClick?: () => void;
};

const LocalizationForm = () => {
  const [formData, setFormData] = useState({
    region: '',
    background: '',
    experience: '',
    interests: ''
  });

  const handleSave = () => {
    localStorage.setItem('userContext', JSON.stringify(formData));
    // Here we would typically make an API call to update the backend
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asia">Asia Pacific</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="namerica">North America</SelectItem>
            <SelectItem value="samerica">South America</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="background">Professional Background</Label>
        <Input 
          id="background"
          placeholder="e.g., Policy Analyst, Researcher"
          onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">AI Safety Experience Level</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Specific Interests</Label>
        <Input 
          id="interests"
          placeholder="e.g., AI Policy, Ethics, Technical Safety"
          onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
        />
      </div>

      <Button className="w-full mt-4" onClick={handleSave}>
        Personalize My Learning Path
      </Button>
    </div>
  );
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
      <div className="flex gap-2 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Globe className="h-4 w-4" />
              Localize
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Personalize Your Learning Path</DialogTitle>
              <DialogDescription>
                Share your background to receive content that's more relevant to your context
              </DialogDescription>
            </DialogHeader>
            <LocalizationForm />
          </DialogContent>
        </Dialog>
        <Badge variant={type === 'pathway' ? 'default' : 'secondary'}>
          {type}
        </Badge>
      </div>
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