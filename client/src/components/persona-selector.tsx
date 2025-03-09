import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

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

export function PersonaSelector() {
  const { user } = useAuth();

  const selectPersonaMutation = useMutation({
    mutationFn: async (persona: string) => {
      const res = await apiRequest("POST", "/api/user/persona", { persona });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    }
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Choose Your Learning Path
        </h1>
        
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
