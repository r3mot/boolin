import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import ToolbarPanel from "./panels/Toolbar";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b h-14 bg-background">
      <div className="text-lg font-semibold text-primary">Boolin</div>
      <div className="flex-1 flex justify-center">
        <ToolbarPanel />
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/yourusername/your-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub repository</span>
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
