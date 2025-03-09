import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HomeIcon, 
  BookOpen, 
  Wrench, 
  LogOut,
  Map
} from "lucide-react";

export function DashboardSidebar() {
  const { logoutMutation } = useAuth();

  return (
    <div className="w-64 bg-sidebar border-r h-screen">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Morph AI Safety</h2>

          <nav className="space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <HomeIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <Link href="/ecosystem">
              <Button variant="ghost" className="w-full justify-start">
                <Map className="mr-2 h-4 w-4" />
                Ecosystem Mapper
              </Button>
            </Link>

            <Link href="/tools">
              <Button variant="ghost" className="w-full justify-start">
                <Wrench className="mr-2 h-4 w-4" />
                Tools
              </Button>
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}