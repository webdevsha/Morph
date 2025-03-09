import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import EcosystemMapper from "@/pages/ecosystem-mapper";
import Tools from "@/pages/tools";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import { PersonaSelector } from "@/components/persona-selector";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PersonaSelector} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/ecosystem" component={EcosystemMapper} />
      <ProtectedRoute path="/tools" component={Tools} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;