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
import { Pencil, CheckCircle, ArrowRight } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">BlueDot Writing Framework</h2>
        
        <Accordion type="single" collapsible className="space-y-4">
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
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Select an Idea for Analysis</h3>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedIdea}
                    onChange={(e) => setSelectedIdea(e.target.value)}
                  >
                    <option value="">Select an idea</option>
                    {ideas.map((idea, index) => (
                      <option key={index} value={idea}>{idea}</option>
                    ))}
                  </select>

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
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
