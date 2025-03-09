import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CourseImporterProps = {
  onCustomization: (customContent: any) => void;
};

export function CourseImporter({ onCustomization }: CourseImporterProps) {
  const [url, setUrl] = useState("");
  const [background, setBackground] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!url.trim() || !background.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both URL and background are required",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/customize-unit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, background })
      });

      if (!response.ok) {
        throw new Error('Failed to customize course unit');
      }

      const data = await response.json();
      onCustomization(data);

      toast({
        title: "Course Unit Imported",
        description: "Your customized learning path is ready!",
      });
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Import BlueDot Course</h3>
        <p className="text-sm text-muted-foreground">
          Paste your BlueDot course URL and tell us about your background for a customized learning experience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            placeholder="Paste BlueDot course URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        
        <div>
          <Input
            placeholder="Your background (e.g., 'Policy Analyst in Tech Regulation')..."
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          />
        </div>

        <Button 
          className="w-full" 
          onClick={handleImport}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Import & Customize'
          )}
        </Button>
      </div>
    </Card>
  );
}
