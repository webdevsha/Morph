import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useLocation } from "wouter";

const personas = [
  {
    id: "learner",
    question: "Why do we need AI safety?",
    description: "Learn about AI safety fundamentals and career paths",
    image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0"
  },
  {
    id: "parent",
    question: "Would AI be safe for my family?",
    description: "Understand AI's impact on future generations",
    image: "https://images.unsplash.com/photo-1510932742089-bef92acabb5b"
  },
  {
    id: "policymaker",
    question: "How can policymakers benefit from AI safety?",
    description: "Learn to create effective AI safety policies",
    image: "https://images.unsplash.com/photo-1472220625704-91e1462799b2"
  }
];

const aiSafetyStats = [
  {
    title: "AI Safety Research Growth",
    value: "300%",
    description: "Increase in AI safety research papers since 2020"
  },
  {
    title: "Global Impact",
    value: "180+",
    description: "Countries developing AI governance frameworks"
  },
  {
    title: "Industry Adoption",
    value: "87%",
    description: "Of tech companies prioritizing AI safety measures"
  }
];

export function PersonaSelector() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [bluedotUrl, setBluedotUrl] = useState("");

  const selectPersonaMutation = useMutation({
    mutationFn: async (persona: string) => {
      if (!user) {
        setLocation("/auth");
        return;
      }
      const res = await apiRequest("POST", "/api/user/persona", { persona });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/dashboard");
    }
  });

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Make AI Safety Education Adaptable to (Almost) Anyone
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your path to understanding AI safety in a way that resonates with your background
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {aiSafetyStats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <h3 className="font-semibold mb-2">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </Card>
          ))}
        </div>

        {/* BlueDot Course URL Input */}
        <Card className="p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <AlertCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-sm flex-grow">
              Already a BlueDot Course learner? Paste your course URL to automatically customize your experience
            </p>
            <div className="flex gap-2 w-full md:w-auto">
              <Input 
                placeholder="Paste BlueDot Course URL" 
                value={bluedotUrl}
                onChange={(e) => setBluedotUrl(e.target.value)}
                className="max-w-md"
              />
              <Button variant="outline" onClick={() => setLocation("/auth")}>
                Import
              </Button>
            </div>
          </div>
        </Card>

        {/* Persona Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {personas.map((persona) => (
            <Card 
              key={persona.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => selectPersonaMutation.mutate(persona.id)}
            >
              <img
                src={persona.image}
                alt={persona.id}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{persona.question}</h2>
              <p className="text-muted-foreground">{persona.description}</p>
              <Button 
                className="w-full mt-4"
                disabled={selectPersonaMutation.isPending}
              >
                Select Path
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}