import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, Brain, Workflow, Globe } from "lucide-react";

export default function FutureWorks() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Building the Future of AI Safety Education</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our vision for evolving AI safety education through personalization, integration, and community participation.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Upcoming Developments 🚀</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">AI Safety Curriculum Integration</h3>
                </div>
                <Badge>Highest Priority</Badge>
                <p className="text-muted-foreground">
                  Fine-tuning our platform to seamlessly integrate with comprehensive AI safety curricula,
                  particularly focusing on alignment with BlueDot's established educational framework.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Curriculum mapping and alignment tools</li>
                  <li>Progress tracking across different frameworks</li>
                  <li>Customized learning paths based on curriculum objectives</li>
                </ul>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Workflow className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Advanced Personalization Engine</h3>
                </div>
                <p className="text-muted-foreground">
                  Enhancing our AI-powered personalization capabilities to provide even more tailored
                  learning experiences based on individual backgrounds and learning styles.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Dynamic content adaptation</li>
                  <li>Real-time learning pace adjustment</li>
                  <li>Multi-modal learning support</li>
                </ul>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Global Learning Network</h3>
                </div>
                <p className="text-muted-foreground">
                  Building a worldwide network of AI safety learners and educators to share insights,
                  experiences, and resources.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Cross-cultural learning exchanges</li>
                  <li>Collaborative projects and discussions</li>
                  <li>Expert mentorship connections</li>
                </ul>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Community Features</h3>
                </div>
                <p className="text-muted-foreground">
                  Expanding our platform's social and collaborative capabilities to foster
                  a vibrant learning community.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Peer review and feedback systems</li>
                  <li>Group learning projects</li>
                  <li>Knowledge sharing forums</li>
                </ul>
              </Card>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-8 mt-12">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-semibold text-center">Participatory Learning Impact 🌟</h2>
              <p className="text-center text-muted-foreground">
                We believe in the power of participatory learning to transform AI safety education.
                By involving learners in the educational process, we create more effective and
                engaging learning experiences.
              </p>

              <div className="grid gap-6 md:grid-cols-3 mt-8">
                <div className="text-center">
                  <GraduationCap className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-medium mb-2">Deeper Understanding</h3>
                  <p className="text-sm text-muted-foreground">
                    Active participation leads to better comprehension and retention
                  </p>
                </div>

                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-medium mb-2">Community Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    Shared learning experiences build stronger communities
                  </p>
                </div>

                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-medium mb-2">Knowledge Creation</h3>
                  <p className="text-sm text-muted-foreground">
                    Collaborative learning generates new insights and perspectives
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold">Get Involved</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us in shaping the future of AI safety education. Whether you're a learner,
              educator, or developer, your contribution matters.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="lg">
                Join Community
              </Button>
              <Button size="lg">
                Contribute
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
