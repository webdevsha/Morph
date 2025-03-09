import { Card } from "@/components/ui/card";
import { ShieldCheck, Brain, Heart, Lightbulb, Scale, Users } from "lucide-react";

export default function Philosophy() {
  const philosophyPoints = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Intentional Safety First 🛡️",
      description: "We believe in embedding safety considerations throughout the entire AI lifecycle, not as an afterthought."
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Adaptive Learning 🧠",
      description: "Our platform dynamically adjusts to your background, making AI safety concepts accessible and relevant to your expertise."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Community-Centric 💝",
      description: "We foster a supportive environment where learners can connect, share insights, and grow together."
    }
  ];

  const ourApproach = [
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "Personalized Pathways",
      description: "We use AI to tailor learning experiences to your unique background and goals."
    },
    {
      icon: <Scale className="h-6 w-6 text-primary" />,
      title: "Balanced Perspective",
      description: "We combine technical depth with practical applicability, ensuring you gain both theoretical understanding and hands-on skills."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Collaborative Growth",
      description: "We believe in learning together, sharing experiences, and building a stronger AI safety community."
    }
  ];

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Our Philosophy 🌟</h1>
          <p className="text-xl text-muted-foreground">
            Building bridges between diverse backgrounds and AI safety understanding
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Core Beliefs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {philosophyPoints.map((point, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  {point.icon}
                  <h3 className="text-lg font-semibold mt-4 mb-2">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ourApproach.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  {item.icon}
                  <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Story 📖</h2>
          <Card className="p-8">
            <p className="text-lg leading-relaxed mb-6">
              We are a team of passionate individuals from diverse backgrounds - technical experts, policy analysts, and educators - united by a common goal: making AI safety education accessible to everyone.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our journey began when we noticed how AI safety resources often catered to specific backgrounds, creating unintentional barriers for many who wanted to contribute to this crucial field.
            </p>
            <p className="text-lg leading-relaxed">
              Today, we're building bridges across different domains of expertise, helping professionals from all backgrounds find their unique path to contributing to AI safety. Together, we're working towards a future where AI development is inherently safe and beneficial for all.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}