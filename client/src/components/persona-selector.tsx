import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackgroundAnalyzer } from "@/components/background-analyzer";
import { CourseImporter } from "@/components/course-importer";

const personas = [
  {
    id: 'technical',
    image: "/personas/technical.jpg",
    title: "Technical Path",
    description: "For engineers, researchers, and technical professionals looking to understand and implement AI safety principles in their work.",
  },
  {
    id: 'regional',
    image: "/personas/regional.jpg",
    title: "Regional Path",
    description: "Customized learning paths for regions without frontier AI development, focusing on local context and regional AI safety needs.",
  },
  {
    id: 'family',
    image: "/personas/family.jpg",
    title: "Family Path",
    description: "Designed for parents and families to understand AI safety impacts on daily life and guide children in the AI era.",
  }
];

const aiSafetyStats = [
  {
    value: "1000+",
    title: "AI Safety Scenarios",
    description: "Comprehensive database of real-world AI safety considerations and case studies"
  },
  {
    value: "50+",
    title: "Learning Pathways",
    description: "Personalized routes to understanding AI safety based on your background"
  },
  {
    value: "24/7",
    title: "Global Access",
    description: "Continuous learning opportunities adapted to your timezone and region"
  }
];

export function PersonaSelector() {
  const [, setLocation] = useLocation();

  const handlePersonaSelect = (persona: typeof personas[0]) => {
    localStorage.setItem('selectedPersona', persona.id);
    setLocation('/ecosystem');
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
          <h2 className="text-2xl font-semibold mb-6">Choose Your Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personas.map((persona) => (
              <Card 
                key={persona.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-primary/20 hover:border-primary"
                onClick={() => handlePersonaSelect(persona)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={persona.image}
                      alt={persona.id}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{persona.title}</h3>
                  <p className="text-muted-foreground mb-4">{persona.description}</p>
                  <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary">
                    Select Path ✨
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Get Personalized Path Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span>Get Custom Path</span>
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