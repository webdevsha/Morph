import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useEffect, useState } from "react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    // Increment visit count in localStorage
    const count = parseInt(localStorage.getItem('visitCount') || '0');
    localStorage.setItem('visitCount', (count + 1).toString());
    setVisitCount(count + 1);
  }, []);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // Allow initial visits without auth, prompt login after 2 visits
  if (!user && visitCount > 2) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Component />;
}