import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Users, Mail, Home } from "lucide-react";
import notesCsbsLogo from "@/assets/notes-csbs-logo.png";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={notesCsbsLogo} alt="Notes CSBS Logo" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-lg">Notes CSBS</span>
            <span className="text-xs text-muted-foreground">BMSCE Resources</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            to="/contributors"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Contributors</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <a href="mailto:notescsbsbmsce@gmail.com" target="_blank" rel="noopener noreferrer">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
