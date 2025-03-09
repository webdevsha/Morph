import { PathwayLayout } from "@/components/pathway-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Brain, Users } from "lucide-react";
import { Link } from "wouter";

export default function FamilyPathway() {
  const modules = [
    {
      title: "AI Safety for Parents",
      description: "Essential knowledge for guiding children in the AI era",
      icon: <Heart className="h-6 w-6 text-primary" />,
      status: "In Progress"
    },
    {
      title: "Digital Safety Guidelines",
      description: "Practical approaches to ensure safe AI interactions for children",
      icon: <Shield className="h-6 w-6 text-primary" />,
      status: "Coming Soon"
    },
    {
      title: "AI Education at Home",
      description: "Teaching children about responsible AI use and awareness",
      icon: <Brain className="h-6 w-6 text-primary" />,
      status: "Coming Soon"
    },
    {
      title: "Family Discussion Framework",
      description: "Facilitating meaningful conversations about AI safety",
      icon: <Users className="h-6 w-6 text-primary" />,
      status: "Coming Soon"
    }
  ];

  return (
    <PathwayLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Family Learning Pathway</h1>
          <p className="text-lg text-muted-foreground">
            Guiding families through AI safety education and awareness
          </p>
        </div>

        {/* BlueDot Integration Card */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">BlueDot Integration Available</h2>
              <p className="text-muted-foreground">
                Access family-oriented AI safety content through BlueDot's learning platform.
              </p>
            </div>
            <Link href="/bluedot-customization">
              <a className="text-primary hover:underline">Import Course →</a>
            </Link>
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