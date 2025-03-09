import { PathwayLayout } from "@/components/pathway-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Book, Users, Network } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function RegionalPathway() {
  const [selectedRegion, setSelectedRegion] = useState("southeast-asia");

  const regions = [
    { value: "southeast-asia", label: "Southeast Asia" },
    { value: "africa", label: "Africa" },
    { value: "latin-america", label: "Latin America" },
    { value: "eastern-europe", label: "Eastern Europe" },
    { value: "middle-east", label: "Middle East" }
  ];

  const modules = [
    {
      title: "Regional AI Safety Context",
      description: "Understanding AI safety in the context of regions without frontier AI development",
      icon: <Globe className="h-6 w-6 text-primary" />,
      status: "In Progress"
    },
    {
      title: "Local Implementation Guidelines",
      description: "Adapting global AI safety principles to local contexts and needs",
      icon: <Book className="h-6 w-6 text-primary" />,
      status: "Coming Soon"
    },
    {
      title: "Community Building",
      description: "Creating regional networks and communities for AI safety",
      icon: <Users className="h-6 w-6 text-primary" />,
      status: "Coming Soon"
    },
    {
      title: "Cross-Regional Collaboration",
      description: "Building partnerships with global AI safety initiatives",
      icon: <Network className="h-6 w-6 text-primary" />,
      status: "Coming Soon"
    }
  ];

  return (
    <PathwayLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Regional Learning Pathway</h1>
          <p className="text-lg text-muted-foreground">
            Adapting AI safety education for regions without frontier AI development
          </p>
        </div>

        {/* BlueDot Integration Card */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">BlueDot Integration Available</h2>
              <p className="text-muted-foreground">
                Access region-specific AI safety content through BlueDot's learning platform.
              </p>
            </div>
            <Link href="/bluedot-customization">
              <a className="text-primary hover:underline">Import Course →</a>
            </Link>
          </div>
        </Card>

        {/* Region Selector */}
        <Card className="p-6 border-primary/20">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Your Region</h2>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Learning Modules */}
        <div className="grid gap-6">
          {modules.map((module, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                {module.icon}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{module.title}</h3>
                    <Badge variant={module.status === "In Progress" ? "default" : "secondary"}>
                      {module.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PathwayLayout>
  );
}