import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, BookOpen, Users, GraduationCap, Globe, Loader2, MessageSquare, AlertCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Pathway } from "@shared/schema";
import { generateLocalizedResources, type LocalizationContext } from "@/lib/ai-localization";
import { CareerProfileForm, type CareerProfile } from "@/components/career-profile-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { CourseImporter } from "@/components/course-importer";

type CourseUnit = {
  title: string;
  description: string;
  examples: string[];
  resource: {
    title: string;
    url: string;
    type: string;
  };
};

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

const LocalizationForm = ({ onSave, initialContext }: {
  onSave: (context: LocalizationContext) => void;
  initialContext?: UserContext;
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserContext>(
    initialContext || {
      region: '',
      background: '',
      experience: '',
      interests: ''
    }
  );

  const handleSave = () => {
    localStorage.setItem('userContext', JSON.stringify(formData));
    onSave(formData);
    toast({
      title: "Preferences Saved",
      description: "Your learning path will now be customized based on your background.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select
          value={formData.region}
          onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asia">Asia Pacific</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="namerica">North America</SelectItem>
            <SelectItem value="samerica">South America</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="background">Professional Background</Label>
        <Input
          id="background"
          value={formData.background}
          placeholder="e.g., Policy Analyst, Researcher"
          onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">AI Safety Experience Level</Label>
        <Select
          value={formData.experience}
          onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Specific Interests</Label>
        <Input
          id="interests"
          value={formData.interests}
          placeholder="e.g., AI Policy, Ethics, Technical Safety"
          onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
        />
      </div>

      <Button className="w-full mt-4" onClick={handleSave}>
        Personalize My Learning Path
      </Button>
    </div>
  );
};

const EcosystemNode = ({
  title,
  description,
  type,
  status = 'active',
  links = [],
  onClick,
  nodeId
}: EcosystemNodeProps) => {
  const [open, setOpen] = useState(false);
  const [userContext, setUserContext] = useState<LocalizationContext | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localizedContent, setLocalizedContent] = useState<any>(null);
  const { toast } = useToast();

  const handleLocalization = async (context: LocalizationContext) => {
    setIsGenerating(true);
    try {
      const content = await generateLocalizedResources(title, description, context);
      setLocalizedContent(content);
      setUserContext(context);
      localStorage.setItem('userContext', JSON.stringify(context));

      toast({
        title: "Content Localized Successfully",
        description: `Resources have been adapted for ${context.region}`,
      });
    } catch (error: any) {
      console.error('Localization error:', error);
      toast({
        title: "Localization Failed",
        description: error.message || "Unable to generate region-specific content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setOpen(false);
    }
  };

  // Filter and adapt resources based on user context and localized content
  const adaptedLinks = [...links];
  if (localizedContent?.resources) {
    adaptedLinks.push(...localizedContent.resources.map((resource: any) => ({
      title: resource.title,
      url: resource.url,
      type: resource.type,
      description: resource.description,
    })));
  }

  return (
    <Card
      className={`
        p-4 border-2 transition-all relative
        ${status === 'completed' ? 'border-green-500 bg-green-50/50' : ''}
        ${status === 'active' ? 'border-primary' : ''}
        ${status === 'locked' ? 'border-gray-200 opacity-50' : ''}
        hover:shadow-md
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex gap-2 items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Globe className="h-4 w-4" />
                {userContext?.region ? 'Relocalize' : 'Localize'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Personalize Your Learning Path</DialogTitle>
                <DialogDescription>
                  Share your background to receive content that's more relevant to your context
                </DialogDescription>
              </DialogHeader>
              <LocalizationForm
                onSave={handleLocalization}
                initialContext={userContext || undefined}
              />
            </DialogContent>
          </Dialog>
          <Badge variant={type === 'pathway' ? 'default' : 'secondary'}>
            {type}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {isGenerating ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Generating localized content...</span>
        </div>
      ) : (
        <>
          {adaptedLinks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Connected Resources:</h4>
              <div className="grid gap-2">
                {adaptedLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    {link.type === 'organization' && <Users className="h-4 w-4" />}
                    {link.type === 'resource' && <BookOpen className="h-4 w-4" />}
                    {link.type === 'standards' && <GraduationCap className="h-4 w-4" />}
                    {link.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {localizedContent?.caseStudies && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Regional Case Studies:</h4>
              <div className="grid gap-2">
                {localizedContent.caseStudies.map((study: any, index: number) => (
                  <div key={index} className="text-sm">
                    <strong>{study.title}</strong>
                    <p className="text-muted-foreground">{study.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

const ConnectorLine = () => (
  <div className="w-px h-8 bg-primary/30 mx-auto" />
);

type UserContext = {
  region: string;
  background: string;
  experience: string;
  interests: string;
};

type EcosystemNodeProps = {
  title: string;
  description: string;
  type: 'pathway' | 'resource' | 'organization';
  status?: 'completed' | 'active' | 'locked';
  links?: Array<{ title: string; url: string; type: string }>;
  onClick?: () => void;
  nodeId: string;
};

export default function EcosystemMapper() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // State management
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [careerSuggestions, setCareerSuggestions] = useState<any>(null);
  const [careerError, setCareerError] = useState<string | null>(null);
  const [showRegistration] = useState(true);
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [customizedUnit, setCustomizedUnit] = useState<CustomizedUnit | null>(null);

  // Get user context
  const selectedPersona = localStorage.getItem('selectedPersona') || 'learner';
  const userBackground = localStorage.getItem('userBackground');
  const isTechnical = selectedPersona === 'technical';

  // Fetch customized course units when userBackground exists
  useEffect(() => {
    if (userBackground) {
      setIsLoadingUnits(true);
      fetch('/api/customize-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ background: userBackground })
      })
        .then(res => res.json())
        .then(data => {
          setCourseUnits(data.units);
        })
        .catch(error => {
          console.error('Failed to load customized units:', error);
          toast({
            title: "Error",
            description: "Failed to load customized course content",
            variant: "destructive"
          });
        })
        .finally(() => setIsLoadingUnits(false));
    }
  }, [userBackground, toast]);

  // Fetch pathways
  const { data: pathways, isLoading } = useQuery<Pathway[]>({
    queryKey: ["/api/pathways"],
  });

  const handleCareerProfile = async (profile: CareerProfile) => {
    try {
      const response = await fetch('/api/career-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to get career suggestions');
      }

      const data = await response.json();
      setCareerSuggestions(data.suggestions);
      setCareerError(null);
    } catch (error: any) {
      setCareerError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Generate customized pathways
  const basePathways = [
    {
      id: 1,
      title: isTechnical ? "AI Alignment Fundamentals" : "AI Governance Fundamentals",
      description: `Tailored introduction to ${isTechnical ? 'technical AI alignment' : 'AI governance'} concepts, adapted for your ${userBackground} background.`,
      type: "pathway",
      persona: selectedPersona,
      ecosystem_links: [
        {
          title: "AI Safety Fundamentals Course",
          url: isTechnical
            ? 'https://course.aisafetyfundamentals.com/home/alignment'
            : 'https://course.aisafetyfundamentals.com/home/governance',
          type: "resource"
        }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto bg-background">
        <div className="max-w-5xl mx-auto">
          {showRegistration && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Save Your Progress</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {userBackground ?
                    `Your learning path is customized for your ${userBackground} background. Register to save your progress!` :
                    'Register to save your progress and get personalized recommendations!'
                  }
                </span>
                <Button variant="outline" onClick={() => setLocation('/auth')}>
                  Register Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {userBackground ?
                `AI Safety Learning Path for ${userBackground}` :
                'AI Safety Ecosystem Map'
              }
            </h1>
            <p className="text-muted-foreground mt-2">
              {userBackground ?
                `A customized learning journey leveraging your ${userBackground} expertise` :
                'Explore the interconnected landscape of AI safety knowledge and resources'
              }
            </p>
          </div>

          <Tabs defaultValue="pathways" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pathways">Learning Pathways</TabsTrigger>
              <TabsTrigger value="career">Career Explorer</TabsTrigger>
              <TabsTrigger value="network">Network View</TabsTrigger>
            </TabsList>

            <TabsContent value="pathways">
              <div className="space-y-8">
                {/* Core Fundamentals */}
                {basePathways.map((pathway) => (
                  <section key={pathway.id} className="space-y-4">
                    <Card className="p-6 border-2 border-primary/20">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">
                          {userBackground ?
                            `${pathway.title} for ${userBackground} Professionals` :
                            pathway.title
                          }
                        </h3>
                        <Badge variant="outline">{pathway.type}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{pathway.description}</p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Core Resources:</h4>
                        <div className="grid gap-2">
                          {pathway.ecosystem_links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-2"
                            >
                              <BookOpen className="h-4 w-4" />
                              {link.title}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </section>
                ))}

                {/* Core Course Units */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Core Learning Units 📚</h2>
                  <div className="grid gap-6">
                    <Card className="p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full p-2 bg-primary/10">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div>
                            <h4 className="text-xl font-semibold mb-2">Beyond chatbots: the expanding frontier of AI capabilities</h4>
                            <p className="text-muted-foreground">
                              Explore how current AI systems like ChatGPT work and understand their rapid evolution in recent years.
                              Discover the key mechanisms driving modern AI advancement.
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>45 minutes</span>
                              <span className="mx-2">•</span>
                              <span>2 exercises</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full p-2 bg-primary/10">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div>
                            <h4 className="text-xl font-semibold mb-2">Artificial general intelligence: on the horizon?</h4>
                            <p className="text-muted-foreground">
                              Understand what AGI is, assess current progress towards achieving it, and explore why even skeptics believe it may arrive soon.
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>30 minutes</span>
                              <span className="mx-2">•</span>
                              <span>2 quizzes, 2 exercises</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full p-2 bg-primary/10">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div>
                            <h4 className="text-xl font-semibold mb-2">AGI will drastically change how we live, for better or worse</h4>
                            <p className="text-muted-foreground">
                              Examine the potential impacts of AGI on society, from unprecedented benefits to critical risks.
                              Learn about key choices we must make to ensure AI benefits humanity.
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>45 minutes</span>
                              <span className="mx-2">•</span>
                              <span>4 exercises</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Customized Course Units - shown after the default units */}
                {isLoadingUnits ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : courseUnits.length > 0 && (
                  <div className="space-y-6 mt-12 pt-12 border-t">
                    <h2 className="text-2xl font-semibold">
                      Customized for Your {userBackground} Background 🎯
                    </h2>
                    <div className="grid gap-6">
                      {courseUnits.map((unit, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-all">
                          <div className="flex items-start gap-4">
                            <div className="rounded-full p-2 bg-primary/10">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-4 flex-1">
                              <div>
                                <h4 className="text-xl font-semibold mb-2">{unit.title}</h4>
                                <p className="text-muted-foreground">{unit.description}</p>
                              </div>

                              <div className="space-y-2">
                                <h5 className="font-medium flex items-center gap-2">
                                  <span>Key Examples</span>
                                  <span>🔍</span>
                                </h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {unit.examples.map((example, i) => (
                                    <li key={i} className="text-muted-foreground">{example}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mt-4">
                                <h5 className="font-medium flex items-center gap-2 mb-2">
                                  <span>Recommended Resource</span>
                                  <span>📚</span>
                                </h5>
                                <a
                                  href={unit.resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 rounded-lg border bg-background hover:bg-accent/5 transition-colors"
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium">{unit.resource.title}</span>
                                    <Badge variant="outline">{unit.resource.type}</Badge>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* BlueDot Course Import */}
                <div className="space-y-6 mt-12 pt-12 border-t">
                  <h2 className="text-2xl font-semibold">Import from BlueDot 🔄</h2>
                  <CourseImporter onCustomization={(data) => setCustomizedUnit(data.customizedUnit)} />
                </div>

                {/* Imported Course Unit */}
                {customizedUnit && (
                  <div className="space-y-6 mt-12 pt-12 border-t">
                    <h2 className="text-2xl font-semibold">
                      Your Customized Unit 🎯
                    </h2>
                    <Card className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{customizedUnit.title}</h3>
                          <p className="text-muted-foreground">{customizedUnit.description}</p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">Role-Play Exercise</h4>
                          <Card className="p-4 bg-primary/5">
                            <div className="space-y-4">
                              <p className="font-medium">Scenario:</p>
                              <p className="text-muted-foreground">{customizedUnit.rolePlay.scenario}</p>

                              <div>
                                <p className="font-medium mb-2">Objectives:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {customizedUnit.rolePlay.objectives.map((obj, i) => (
                                    <li key={i} className="text-muted-foreground">{obj}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <p className="font-medium mb-2">Setup:</p>
                                <p className="text-muted-foreground">{customizedUnit.rolePlay.setup}</p>
                              </div>

                              <div>
                                <p className="font-medium mb-2">Key Questions:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {customizedUnit.rolePlay.keyQuestions.map((q, i) => (
                                    <li key={i} className="text-muted-foreground">{q}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </Card>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">Relevant News & Updates</h4>
                          <div className="grid gap-4">
                            {customizedUnit.relevantNews.map((news, i) => (
                              <a
                                key={i}
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                              >
                                <h5 className="font-medium mb-2">{news.title}</h5>
                                <p className="text-sm text-muted-foreground">{news.relevance}</p>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="career">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">AI Safety Career Explorer</h2>
                    <p className="text-muted-foreground mt-2">
                      Discover personalized career paths in AI safety based on your background
                    </p>
                  </div>
                  <CareerProfileForm onProfileSubmit={handleCareerProfile} />
                </div>

                {careerError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{careerError}</AlertDescription>
                  </Alert>
                )}

                {careerSuggestions && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      {careerSuggestions.map((suggestion: any, index: number) => (
                        <Card key={index} className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold">{suggestion.role}</h3>
                            <Badge variant={suggestion.type === 'full-time' ? 'default' : 'secondary'}>
                              {suggestion.type}
                            </Badge>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Why This Path?</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {suggestion.reasoning.map((reason: string, i: number) => (
                                  <li key={i}>{reason}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Career Trajectory</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                  <span className="text-sm">{suggestion.trajectory.startingPoint}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                                  <span className="text-sm">{suggestion.trajectory.intermediateStep}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-primary/30" />
                                  <span className="text-sm">{suggestion.trajectory.targetRole}</span>
                                </div>
                              </div>
                            </div>

                            {suggestion.resources && (
                              <div>
                                <h4 className="font-medium mb-2">Recommended Resources</h4>
                                <div className="space-y-2">
                                  {suggestion.resources.map((resource: any, i: number) => (
                                    <a
                                      key={i}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-3 rounded-lg border bg-background hover:bg-accent/5 transition-colors"
                                    >
                                      <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium">{resource.name}</span>
                                        <Badge variant="outline">{resource.type}</Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {resource.description}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Need More Guidance?</h3>
                          <p className="text-sm text-muted-foreground">
                            Join our Slack community to connect with mentors and peers in AI safety
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="lg"
                          className="gap-2"
                          asChild
                        >
                          <a href="https://join.slack.com/t/ai-safety-community/shared_invite/your-invite-link" target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="h-4 w-4" />
                            Connect on Slack
                          </a>
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="network">
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Network Visualization Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    An interactive network view of the AI safety ecosystem will be available here
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}