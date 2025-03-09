import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import EcosystemMapper from "@/pages/ecosystem-mapper";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import { PersonaSelector } from "@/components/persona-selector";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Philosophy from "@/pages/philosophy";
import FutureWorks from "@/pages/future-works";
import BlueDotCustomization from "@/pages/bluedot-customization";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={PersonaSelector} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/ecosystem" component={EcosystemMapper} />
          <Route path="/philosophy" component={Philosophy} />
          <Route path="/future-works" component={FutureWorks} />
          <Route path="/bluedot-customization" component={BlueDotCustomization} />
          <ProtectedRoute path="/dashboard" component={HomePage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
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