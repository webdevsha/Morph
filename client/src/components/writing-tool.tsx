import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Pencil, CheckCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

// Add AI feedback interface
type AIFeedback = {
  ideas?: string[];
  audience?: {
    suggestions: string[];
    improvements: string[];
  };
  headlines?: string[];
  story?: {
    structure: string[];
    improvements: string[];
  };
  outline?: {
    suggestions: string[];
    flow: string[];
  };
};

export function WritingTool() {
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string>("");
  const [audienceAnalysis, setAudienceAnalysis] = useState({
    understanding: "",
    notExplaining: "",
    interest: "",
    takeaways: ""
  });
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [selectedHeadline, setSelectedHeadline] = useState("");
  const [story, setStory] = useState({
    mainStory: "",
    fulfillment: "",
    journey: ""
  });
  const [outline, setOutline] = useState({
    headline: "",
    points: ["", "", ""],
    conclusion: ""
  });

  // Add AI feedback state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback>({});

  const generateAIFeedback = async (step: string, content: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, content })
      });

      const feedback = await response.json();
      setAiFeedback(prev => ({ ...prev, ...feedback }));

      toast({
        title: "AI Feedback Generated",
        description: "Review the suggestions to improve your content",
      });
    } catch (error) {
      toast({
        title: "Failed to generate feedback",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIdeaSubmit = (newIdea: string) => {
    if (newIdea.trim()) {
      setIdeas([...ideas, newIdea]);
      toast({
        title: "Idea Added",
        description: "Let's get AI feedback on your ideas!",
      });
    }
  };

  const handleHeadlineSubmit = (newHeadline: string) => {
    if (newHeadline.trim()) {
      setHeadlines([...headlines, newHeadline]);
      toast({
        title: "Headline Added",
        description: "Let's get AI feedback on your headlines!",
      });
    }
  };

  const renderAIFeedback = (feedbackType: keyof AIFeedback) => {
    if (isGenerating) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating AI feedback...
        </div>
      );
    }

    const feedback = aiFeedback[feedbackType];
    if (!feedback) return null;

    return (
      <div className="mt-4 p-4 bg-primary/5 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Sparkles className="h-4 w-4" />
          AI Suggestions
        </div>
        {Array.isArray(feedback) ? (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {feedback.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          Object.entries(feedback).map(([key, items]) => (
            <div key={key}>
              <h4 className="font-medium capitalize">{key}:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderStep = (
    stepNumber: number,
    title: string,
    children: React.ReactNode
  ) => (
    <Card className="p-6 mb-8">
      <h3 className="text-xl font-semibold pb-4 mb-6 border-b">
        Step {stepNumber}: {title}
      </h3>
      {children}
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">BlueDot Writing Framework</h2>
      <p className="text-muted-foreground mb-8">
        Get AI feedback at any step of your writing process. Each step is independent - feel free to start wherever you'd like!
      </p>

      {/* Step 1: Ideas */}
      {renderStep(1, "Generate Ideas & Analyze Audience", (
        <div className="space-y-6">
          <div>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter an idea"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    handleIdeaSubmit(input.value);
                    input.value = '';
                  }
                }}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  handleIdeaSubmit(input.value);
                  input.value = '';
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              {ideas.map((idea, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{idea}</span>
                </div>
              ))}
            </div>

            {ideas.length > 0 && (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => generateAIFeedback('ideas', { ideas })}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Feedback on Ideas
              </Button>
            )}
            {renderAIFeedback('ideas')}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Audience Analysis</h4>
            <div>
              <label className="block text-sm font-medium mb-1">
                What does your target audience already understand?
              </label>
              <Textarea
                value={audienceAnalysis.understanding}
                onChange={(e) => setAudienceAnalysis({
                  ...audienceAnalysis,
                  understanding: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                What will you not be explaining?
              </label>
              <Textarea
                value={audienceAnalysis.notExplaining}
                onChange={(e) => setAudienceAnalysis({
                  ...audienceAnalysis,
                  notExplaining: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Why would they be interested?
              </label>
              <Textarea
                value={audienceAnalysis.interest}
                onChange={(e) => setAudienceAnalysis({
                  ...audienceAnalysis,
                  interest: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                What takeaways will they have?
              </label>
              <Textarea
                value={audienceAnalysis.takeaways}
                onChange={(e) => setAudienceAnalysis({
                  ...audienceAnalysis,
                  takeaways: e.target.value
                })}
              />
            </div>

            {audienceAnalysis.understanding && (
              <Button
                variant="outline"
                onClick={() => generateAIFeedback('audience', audienceAnalysis)}
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Feedback on Audience Analysis
              </Button>
            )}
            {renderAIFeedback('audience')}
          </div>
        </div>
      ))}

      {/* Step 2: Headlines */}
      {renderStep(2, "Build Headlines", (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-accent/10 p-4 rounded-lg">
            <div>
              <h4 className="font-medium">Guidelines:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Be clear, not clever</li>
                <li>Specify the WHO</li>
                <li>Specify the WHAT</li>
                <li>Specify the WHY</li>
              </ul>
            </div>
            <div className="text-sm">
              <span className="font-medium">Current Progress:</span>
              <div>{headlines.length} headlines created</div>
            </div>
          </div>

          <div>
            <Input 
              placeholder="Enter a headline following the guidelines"
              className="mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  handleHeadlineSubmit(input.value);
                  input.value = '';
                }
              }}
            />
            <ScrollArea className="h-40 w-full rounded-md border p-4">
              {headlines.map((headline, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-2 border-b last:border-0"
                  onClick={() => setSelectedHeadline(headline)}
                >
                  <span className="font-mono text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span className={selectedHeadline === headline ? "font-medium" : ""}>
                    {headline}
                  </span>
                </div>
              ))}
            </ScrollArea>

            {headlines.length > 0 && (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => generateAIFeedback('headlines', { headlines })}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Feedback on Headlines
              </Button>
            )}
            {renderAIFeedback('headlines')}
          </div>
        </div>
      ))}

      {/* Step 3: Story Development */}
      {renderStep(3, "Develop Your Story", (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              What story are you trying to tell?
            </label>
            <Textarea
              value={story.mainStory}
              onChange={(e) => setStory({
                ...story,
                mainStory: e.target.value
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              How are you fulfilling the promise in your headline?
            </label>
            <Textarea
              value={story.fulfillment}
              onChange={(e) => setStory({
                ...story,
                fulfillment: e.target.value
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              How are you taking the reader from A to B?
            </label>
            <Textarea
              value={story.journey}
              onChange={(e) => setStory({
                ...story,
                journey: e.target.value
              })}
            />
          </div>

          {story.mainStory && (
            <Button
              variant="outline"
              onClick={() => generateAIFeedback('story', story)}
              disabled={isGenerating}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Feedback on Story Structure
            </Button>
          )}
          {renderAIFeedback('story')}
        </div>
      ))}

      {/* Step 4: Outline */}
      {renderStep(4, "Create Outline", (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Final Headline
            </label>
            <Input
              value={outline.headline}
              onChange={(e) => setOutline({
                ...outline,
                headline: e.target.value
              })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Main Points
            </label>
            {outline.points.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <Input
                  value={point}
                  placeholder={`Main point ${index + 1}`}
                  onChange={(e) => {
                    const newPoints = [...outline.points];
                    newPoints[index] = e.target.value;
                    setOutline({
                      ...outline,
                      points: newPoints
                    });
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOutline({
                ...outline,
                points: [...outline.points, ""]
              })}
              className="w-full mt-2"
            >
              Add Point
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              One-Sentence Conclusion
            </label>
            <Textarea
              value={outline.conclusion}
              onChange={(e) => setOutline({
                ...outline,
                conclusion: e.target.value
              })}
            />
          </div>

          {outline.headline && outline.points.some(p => p) && outline.conclusion && (
            <Button
              variant="outline"
              onClick={() => generateAIFeedback('outline', outline)}
              disabled={isGenerating}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Feedback on Outline
            </Button>
          )}
          {renderAIFeedback('outline')}
        </div>
      ))}
    </div>
  );
}