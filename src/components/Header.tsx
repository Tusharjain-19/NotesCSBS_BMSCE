import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Users } from "lucide-react";
import bmsceLogo from "@/assets/bmsce-logo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={bmsceLogo} alt="BMSCE Logo" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">notes.csbs</span>
            <span className="text-xs text-muted-foreground">BMSCE Resources</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/contributors"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Contributors</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
