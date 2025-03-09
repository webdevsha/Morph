import { Link } from "wouter";
import { GraduationCap, Users, BookOpen, GithubIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Morph AI Safety</h3>
            <p className="text-sm text-muted-foreground">
              Making AI safety education adaptable and accessible through personalized learning experiences.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Participatory Learning</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Community-driven content adaptation</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>Peer learning networks</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Shared knowledge creation</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get Involved</h3>
            <p className="text-sm text-muted-foreground">
              Join our community of learners and contributors to shape the future of AI safety education.
            </p>
            <div className="flex items-center gap-2">
              <GithubIcon className="h-4 w-4" />
              <a 
                href="https://github.com/yourusername/morph-ai-safety"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Contribute on GitHub
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Impact</h3>
            <p className="text-sm text-muted-foreground">
              Through participatory learning, we're building a more inclusive and effective approach to AI safety education.
            </p>
            <Link href="/future-works">
              <a className="text-sm text-primary hover:underline">Learn about our future plans</a>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Morph AI Safety. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
