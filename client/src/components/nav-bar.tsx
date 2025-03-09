import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function NavBar() {
  const { user } = useAuth();

  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/">
              <a className="flex items-center font-bold text-xl">
                Morph AI Safety
              </a>
            </Link>
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
