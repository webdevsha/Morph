import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";

export function CourseImporter() {
  const [url, setUrl] = useState("");
  const [background, setBackground] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleUrlSubmit = () => {
    if (!url.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "BlueDot course URL is required",
        variant: "destructive",
      });
      return;
    }

    // Clear any existing stored data
    localStorage.removeItem('importUrl');
    localStorage.removeItem('userBackground');
    queryClient.clear();
    setShowBackgroundDialog(true);
  };

  const handleImport = async () => {
    if (!background.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Background information is required",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Store the values for the customized unit page
      localStorage.setItem('importUrl', url);
      localStorage.setItem('userBackground', background);

      // Redirect to the BlueDot customization page
      setLocation('/bluedot-customization');

      toast({
        title: "Importing Course Unit",
        description: "Preparing your customized learning experience...",
      });
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setShowBackgroundDialog(false);
    }
  };

  return (
    <>
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Import BlueDot Course</h3>
          <p className="text-sm text-muted-foreground">
            Import a specific course unit from BlueDot and get a customized learning experience
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

          <Button 
            className="w-full" 
            onClick={handleUrlSubmit}
            disabled={isProcessing}
          >
            Import Course Unit
          </Button>
        </div>
      </Card>

      <Dialog 
        open={showBackgroundDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setBackground("");
          }
          setShowBackgroundDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Your Learning Experience</DialogTitle>
            <DialogDescription>
              Tell us about your background to receive content that's relevant to your context
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Your background (e.g., 'Policy Analyst in Tech Regulation')..."
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
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
                'Continue'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}