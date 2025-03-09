import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlobeIcon, Brain, Shield, Users, AlertTriangle } from "lucide-react";

// Global AI Safety Initiatives Data
const initiatives = [
  {
    name: "BlueDot Learning",
    location: "United Kingdom",
    description: "AI safety education and curriculum development platform.",
    type: "Education",
    link: "https://bluedot.org"
  },
  {
    name: "AI Safety Camp",
    location: "Global",
    description: "Intensive research camps focused on AI safety problems.",
    type: "Research & Training",
    link: "https://aisafety.camp"
  },
  {
    name: "Pause AI",
    location: "Global",
    description: "Initiative advocating for responsible AI development.",
    type: "Advocacy",
    link: "https://pauseai.info"
  },
  {
    name: "MIT AI Risk Initiative",
    location: "United States",
    description: "Comprehensive research on AI risks and safety measures.",
    type: "Research",
    link: "https://airisk.mit.edu"
  }
];

// Risk Categories from MIT's AI Risk Repository
const riskCategories = [
  {
    domain: "Discrimination & Toxicity",
    examples: ["Unfair discrimination", "Exposure to toxic content", "Unequal performance across groups"],
    icon: <Users className="h-6 w-6" />
  },
  {
    domain: "Privacy & Security",
    examples: ["Data leaks", "System vulnerabilities", "Privacy compromises"],
    icon: <Shield className="h-6 w-6" />
  },
  {
    domain: "AI System Safety",
    examples: ["Goal misalignment", "Unintended consequences", "System limitations"],
    icon: <Brain className="h-6 w-6" />
  },
  {
    domain: "Socioeconomic Impact",
    examples: ["Job displacement", "Economic inequality", "Power centralization"],
    icon: <AlertTriangle className="h-6 w-6" />
  }
];

export default function Ecosystem() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">AI Safety Ecosystem 🌍</h1>
          <p className="text-xl text-muted-foreground">
            Mapping global initiatives and understanding AI safety risks
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <GlobeIcon className="h-6 w-6 text-primary" />
            Global AI Safety Initiatives
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{initiative.name}</h3>
                    <Badge variant="outline">{initiative.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{initiative.location}</p>
                  <p className="text-muted-foreground">{initiative.description}</p>
                  <a 
                    href={initiative.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-block mt-2"
                  >
                    Learn more →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">AI Risk Categories</h2>
            <a 
              href="https://airisk.mit.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Data source: MIT AI Risk Repository
            </a>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground italic">
              Note: This is a simplified overview of AI risks. For a comprehensive understanding,
              please visit the MIT AI Risk Repository.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {riskCategories.map((category, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <h3 className="text-lg font-semibold">{category.domain}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.examples.map((example, i) => (
                      <li key={i} className="text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
