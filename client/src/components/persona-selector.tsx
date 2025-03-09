import {  useLocation } from "wouter";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackgroundAnalyzer } from "@/components/background-analyzer";
import { AlertCircle } from "lucide-react";
import { personas, aiSafetyStats } from "@/data/personaData";

export function PersonaSelector() {
  const [, setLocation] = useLocation();
  const [bluedotUrl, setBluedotUrl] = useState("");

  const handlePersonaSelect = (persona: typeof personas[0]) => {
    // Store selected persona
    localStorage.setItem('selectedPersona', persona.id);

    // Direct navigation without auth check
    if (persona.id === 'parent') {
      setLocation('/tools');
    } else {
      setLocation('/ecosystem');
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {aiSafetyStats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <h3 className="font-semibold mb-2">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </Card>
          ))}
        </div>

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
              <Button variant="outline" onClick={() => setLocation("/ecosystem")}>
                Import
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side: Manual persona selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Choose Your Path</h2>
            <div className="grid gap-6">
              {personas.map((persona) => (
                <Card 
                  key={persona.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePersonaSelect(persona)}
                >
                  <img
                    src={persona.image}
                    alt={persona.id}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-2">{persona.question}</h2>
                  <p className="text-muted-foreground">{persona.description}</p>
                  <Button className="w-full mt-4">
                    Select Path
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side: Background analysis */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Get Personalized Path</h2>
            <BackgroundAnalyzer onPersonaSelect={(persona) => {
              localStorage.setItem('selectedPersona', persona);
              setLocation('/ecosystem');
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}