import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function NavBar() {
  const { user } = useAuth();

  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="flex items-center font-bold text-xl">
                Morph AI Safety
              </a>
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link href="/ecosystem">
                <a className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Ecosystem
                </a>
              </Link>
              <Link href="/philosophy">
                <a className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Our Philosophy
                </a>
              </Link>
              <Link href="/future-works">
                <a className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Future Works
                </a>
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            {user ? (
              <span className="text-sm text-muted-foreground mr-4">
                Welcome, {user.username}
              </span>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}