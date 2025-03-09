import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Link as LinkIcon } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type CustomizedUnit = {
  title: string;
  description: string;
  rolePlay: {
    scenario: string;
    objectives: string[];
    setup: string;
    keyQuestions: string[];
  };
  relevantNews: Array<{
    title: string;
    url: string;
    relevance: string;
  }>;
};

export default function BlueDotCustomization() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customizedUnit, setCustomizedUnit] = useState<CustomizedUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [background, setBackground] = useState("");

  useEffect(() => {
    const url = localStorage.getItem('importUrl');
    const background = localStorage.getItem('userBackground');
    setBackground(background || '');

    if (!url || !background) {
      toast({
        title: "Missing Information",
        description: "Please import a course unit first",
        variant: "destructive",
      });
      setLocation('/');
      return;
    }

    loadCustomizedUnit(url, background);
  }, [setLocation, toast]);

  const loadCustomizedUnit = async (url: string, background: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customize-unit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, background })
      });

      if (!response.ok) {
        throw new Error('Failed to load customized unit');
      }

      const data = await response.json();
      setCustomizedUnit(data.customizedUnit);
    } catch (error) {
      console.error('Failed to load customized unit:', error);
      toast({
        title: "Error",
        description: "Failed to load customized content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlUpdate = async () => {
    if (!newUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('importUrl', newUrl);
    setShowUrlDialog(false);
    loadCustomizedUnit(newUrl, background);
  };

  const handleNewSuggestion = async () => {
    const url = localStorage.getItem('importUrl');
    if (url && background) {
      loadCustomizedUnit(url, background);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customizedUnit) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Customized BlueDot Unit</h1>
              <p className="text-lg text-muted-foreground">
                Personalized learning experience for your {background} background
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUrlDialog(true)}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Change URL
              </Button>
              <Button 
                onClick={handleNewSuggestion}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                New Example
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{customizedUnit.title}</h2>
                <p className="text-lg text-muted-foreground">{customizedUnit.description}</p>
              </div>
            </Card>

            <Card className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Interactive Role-Play Exercise</h2>
              <div className="space-y-4 bg-primary/5 rounded-lg p-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Scenario</h3>
                  <p className="text-muted-foreground">{customizedUnit.rolePlay.scenario}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {customizedUnit.rolePlay.objectives.map((obj, i) => (
                      <li key={i} className="text-muted-foreground">{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Exercise Setup</h3>
                  <p className="text-muted-foreground">{customizedUnit.rolePlay.setup}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Reflection Questions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {customizedUnit.rolePlay.keyQuestions.map((q, i) => (
                      <li key={i} className="text-muted-foreground">{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Relevant Updates & Context</h2>
              <div className="grid gap-4">
                {customizedUnit.relevantNews.map((news, i) => (
                  <a
                    key={i}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                  >
                    <h3 className="text-lg font-medium mb-2">{news.title}</h3>
                    <p className="text-muted-foreground">{news.relevance}</p>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Course URL</DialogTitle>
            <DialogDescription>
              Enter a new BlueDot course URL to customize
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Paste new BlueDot course URL..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <Button 
              className="w-full" 
              onClick={handleUrlUpdate}
            >
              Update URL
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}