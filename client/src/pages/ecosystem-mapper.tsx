import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Pathway } from "@shared/schema";

type PathwayBoxProps = {
  title: string;
  description: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick?: () => void;
};

const PathwayBox = ({ title, description, isCompleted, isActive, onClick }: PathwayBoxProps) => (
  <Card
    className={`
      p-4 border-2 cursor-pointer transition-all
      ${isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200'}
      ${isActive ? 'ring-2 ring-primary' : ''}
      hover:shadow-md
    `}
    onClick={onClick}
  >
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </Card>
);

const ConnectorLine = () => (
  <div className="w-px h-8 bg-gray-300 mx-auto" />
);

export default function EcosystemMapper() {
  const { data: pathways, isLoading } = useQuery<Pathway[]>({
    queryKey: ["/api/pathways"],
  });

  const [selectedPathway, setSelectedPathway] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">AI Safety Learning Path</h1>
            <p className="text-muted-foreground mt-2">
              Your guided journey through AI safety knowledge and skills
            </p>
          </div>

          <div className="space-y-6">
            {/* Level 1: Fundamentals */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Level 1: Fundamentals</h2>
              <div className="grid gap-4">
                <PathwayBox
                  title="Introduction to AI Safety"
                  description="Core concepts and principles"
                  isCompleted={true}
                  isActive={selectedPathway === 1}
                  onClick={() => setSelectedPathway(1)}
                />
                <ConnectorLine />
                <PathwayBox
                  title="Risk Assessment Basics"
                  description="Understanding and identifying AI risks"
                  isActive={selectedPathway === 2}
                  onClick={() => setSelectedPathway(2)}
                />
              </div>
            </section>

            {/* Level 2: Technical Understanding */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Level 2: Technical Understanding</h2>
              <div className="grid gap-4">
                <PathwayBox
                  title="AI Systems Architecture"
                  description="Understanding how AI systems are built"
                  isActive={selectedPathway === 3}
                  onClick={() => setSelectedPathway(3)}
                />
                <ConnectorLine />
                <PathwayBox
                  title="Safety Mechanisms"
                  description="Technical approaches to AI safety"
                  isActive={selectedPathway === 4}
                  onClick={() => setSelectedPathway(4)}
                />
              </div>
            </section>

            {/* Level 3: Advanced Topics */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Level 3: Advanced Topics</h2>
              <div className="grid gap-4">
                <PathwayBox
                  title="Value Alignment"
                  description="Ensuring AI systems align with human values"
                  isActive={selectedPathway === 5}
                  onClick={() => setSelectedPathway(5)}
                />
                <ConnectorLine />
                <PathwayBox
                  title="Long-term Impact"
                  description="Understanding and planning for future AI developments"
                  isActive={selectedPathway === 6}
                  onClick={() => setSelectedPathway(6)}
                />
              </div>
            </section>
          </div>

          {/* Selected Pathway Details */}
          {selectedPathway && (
            <Card className="mt-8 p-6">
              <h3 className="text-lg font-semibold mb-4">Pathway Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Prerequisites</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Basic understanding of AI concepts</li>
                    <li>Completion of previous levels</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Learning Outcomes</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Understand core AI safety principles</li>
                    <li>Identify potential risks and mitigation strategies</li>
                  </ul>
                </div>
                <Button className="w-full">Start Learning</Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}