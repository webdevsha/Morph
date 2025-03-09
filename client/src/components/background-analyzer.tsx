import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BackgroundAnalyzerProps = {
  onPersonaSelect: (persona: string) => void;
};

export function BackgroundAnalyzer({ onPersonaSelect }: BackgroundAnalyzerProps) {
  const [background, setBackground] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      const response = await fetch('/api/analyze-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ background })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze background');
      }

      const data = await response.json();

      // Store both the persona and the background
      localStorage.setItem('userBackground', background);
      onPersonaSelect(data.persona);

      toast({
        title: "Path Selected",
        description: `We've found the perfect learning path for your ${data.role} background!`,
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
  );
}