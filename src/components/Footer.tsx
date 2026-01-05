import { Mail } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-md py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          © {new Date().getFullYear()} Notes CSBS - BMSCE. All rights reserved.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2"
        >
          <a href="mailto:notescsbsbmsce@gmail.com">
            <Mail className="h-4 w-4" />
            Send Feedback
          </a>
        </Button>
      </div>
    </footer>
  );
}
