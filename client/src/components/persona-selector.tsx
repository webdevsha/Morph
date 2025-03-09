import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackgroundAnalyzer } from "@/components/background-analyzer";
import { AlertCircle } from "lucide-react";
import { personas, aiSafetyStats } from "@/data/personaData";
import { CourseImporter } from "@/components/course-importer";

export function PersonaSelector() {
  const [, setLocation] = useLocation();

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

        {/* BlueDot Course Import Card */}
        <Card className="p-6 mb-12 border-primary/20 bg-primary/5">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Already a BlueDot Learner? 🎯</h2>
            <p className="text-muted-foreground mt-2">
              Import your course unit to get a personalized learning experience
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <CourseImporter />
          </div>
        </Card>

        {/* Choose Your Path Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
            <span>Or Choose Your Path</span> 
            <span className="text-2xl">🎯</span>
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {personas.map((persona) => (
              <Card 
                key={persona.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-primary/20 hover:border-primary bg-primary/5"
                onClick={() => handlePersonaSelect(persona)}
              >
                <div className="flex items-center gap-8">
                  <img
                    src={persona.image}
                    alt={persona.id}
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-3">{persona.question}</h2>
                    <p className="text-muted-foreground text-lg mb-4">{persona.description}</p>
                    <Button className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary">
                      Select Path ✨
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Get Personalized Path Section */}
        <div className="space-y-6">
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
  );
}