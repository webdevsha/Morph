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
    localStorage.setItem('selectedPersona', persona.id);
    if (persona.id === 'parent') {
      setLocation('/tools');
    } else {
      setLocation('/ecosystem');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            M
          </div>
          <h1 className="text-2xl font-semibold ml-2">orph</h1>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Make AI Safety Education Adaptable to (Almost) Anyone ✨
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your path to understanding AI safety in a way that resonates with your background 🌟
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {aiSafetyStats.map((stat, index) => (
            <Card key={index} className="p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <h3 className="font-semibold mb-2">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-12 border-primary/20 bg-primary/5">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <AlertCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-sm flex-grow">
              Already a BlueDot Course learner? 🎯 Paste your course URL to automatically customize your experience
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

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left side: Manual persona selection */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Choose Your Path</span> 
              <span className="text-2xl">🎯</span>
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2"> {/* Added grid-cols-2 for medium screens and up */}
              {personas.map((persona) => (
                <Card 
                  key={persona.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all border-primary/20 hover:border-primary bg-primary/5"
                  onClick={() => handlePersonaSelect(persona)}
                >
                  <div className="flex items-start gap-6">
                    <img
                      src={persona.image}
                      alt={persona.id}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{persona.question}</h2>
                      <p className="text-muted-foreground mb-4">{persona.description}</p>
                      <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary">
                        Select Path ✨
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side: Background analysis */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Get Personalized Path</span>
              <span className="text-2xl">🎨</span>
            </h2>
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