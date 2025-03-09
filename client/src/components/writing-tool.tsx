import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    if (ideas.length < 5) {
      setIdeas([...ideas, newIdea]);
      toast({
        title: "Idea Added",
        description: `${5 - ideas.length - 1} more ideas to go!`,
      });
    }
  };

  const handleHeadlineSubmit = (newHeadline: string) => {
    if (headlines.length < 10) {
      setHeadlines([...headlines, newHeadline]);
      toast({
        title: "Headline Added",
        description: `${10 - headlines.length - 1} more headlines to go!`,
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">BlueDot Writing Framework</h2>

        <Accordion type="single" collapsible defaultValue="step1" className="space-y-4">
          {/* Step 1: Ideas and Audience Analysis */}
          <AccordionItem value="step1">
            <AccordionTrigger className="text-lg font-semibold">
              Step 1: Top Ideas & Audience Analysis
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Add Your Top 5 Ideas</h3>
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
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    {ideas.map((idea, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{idea}</span>
                      </div>
                    ))}
                  </div>
                  {ideas.length >= 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
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
                  <h3 className="font-medium">Select an Idea for Analysis</h3>
                  <div className="space-y-2">
                    {ideas.map((idea, index) => (
                      <Button
                        key={index}
                        variant={selectedIdea === idea ? "default" : "outline"}
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedIdea(idea)}
                      >
                        {idea}
                      </Button>
                    ))}
                  </div>

                  {selectedIdea && (
                    <div className="space-y-4">
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
                          What will you not be explaining in the article?
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
                          Why would your target audience be interested?
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
                          What takeaways will your audience have?
                        </label>
                        <Textarea
                          value={audienceAnalysis.takeaways}
                          onChange={(e) => setAudienceAnalysis({
                            ...audienceAnalysis,
                            takeaways: e.target.value
                          })}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => generateAIFeedback('audience', audienceAnalysis)}
                        disabled={isGenerating}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Feedback on Audience Analysis
                      </Button>
                      {renderAIFeedback('audience')}
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 2: Headlines */}
          <AccordionItem value="step2">
            <AccordionTrigger className="text-lg font-semibold">
              Step 2: Build 10 Headlines
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
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
                    <div>{headlines.length}/10 headlines created</div>
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
                      size="sm"
                      className="mt-4"
                      onClick={() => generateAIFeedback('headlines', { headlines, selectedIdea })}
                      disabled={isGenerating}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Feedback on Headlines
                    </Button>
                  )}
                  {renderAIFeedback('headlines')}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 3: Story Development */}
          <AccordionItem value="step3">
            <AccordionTrigger className="text-lg font-semibold">
              Step 3: Your Story
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
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
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Feedback on Story Structure
                  </Button>
                )}
                {renderAIFeedback('story')}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 4: Outline */}
          <AccordionItem value="step4">
            <AccordionTrigger className="text-lg font-semibold">
              Step 4: Scrappy Outline
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
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
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Feedback on Outline
                  </Button>
                )}
                {renderAIFeedback('outline')}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}