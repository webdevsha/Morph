import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BackgroundAnalyzerProps = {
  onPersonaSelect: (persona: string) => void;
};

type CourseUnit = {
  title: string;
  description: string;
  examples: string[];
  outcomes: string[];
};

export function BackgroundAnalyzer({ onPersonaSelect }: BackgroundAnalyzerProps) {
  const [background, setBackground] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);
  const { toast } = useToast();

  const analyzeBackground = async () => {
    if (!background.trim()) {
      toast({
        title: "Please enter your background",
        description: "Tell us about your current role and expertise",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // First, analyze background for persona
      const personaResponse = await fetch('/api/analyze-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ background })
      });

      if (!personaResponse.ok) {
        throw new Error('Failed to analyze background');
      }

      const personaData = await personaResponse.json();

      // Then, get customized course content
      const courseResponse = await fetch('/api/customize-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ background })
      });

      if (!courseResponse.ok) {
        throw new Error('Failed to customize course content');
      }

      const courseData = await courseResponse.json();
      setCourseUnits(courseData.units);

      // Store both the persona and the background
      localStorage.setItem('userBackground', background);
      onPersonaSelect(personaData.persona);

      toast({
        title: "Path Selected",
        description: `We've found the perfect learning path for your ${personaData.role} background!`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Personalize Your Journey</h3>
          <p className="text-sm text-muted-foreground">
            Tell us about your background (e.g., "I am an astrophysicist") and we'll suggest the most relevant learning path
          </p>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Enter your background..."
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                analyzeBackground();
              }
            }}
          />
          <Button 
            className="w-full" 
            onClick={analyzeBackground}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Find My Path'
            )}
          </Button>
        </div>
      </Card>

      {courseUnits.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Customized Learning Path</h3>
          <div className="grid gap-4">
            {courseUnits.map((unit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h4 className="text-lg font-semibold">{unit.title}</h4>
                    <p className="text-muted-foreground">{unit.description}</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Key Examples:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {unit.examples.map((example, i) => (
                          <li key={i} className="text-muted-foreground">{example}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Learning Outcomes:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {unit.outcomes.map((outcome, i) => (
                          <li key={i} className="text-muted-foreground">{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}