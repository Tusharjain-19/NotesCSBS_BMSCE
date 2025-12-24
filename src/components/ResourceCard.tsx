import { ExternalLink, FileText, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourceCardProps {
  id: number;
  title: string;
  fileUrl: string;
  unit?: string | null;
  year?: number | null;
  index: number;
}

export function ResourceCard({ id, title, fileUrl, unit, year, index }: ResourceCardProps) {
  return (
    <a 
      href={fileUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block"
    >
      <Card 
        className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md animate-fade-in"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground leading-snug pr-6 line-clamp-2">
                {title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                {unit && (
                  <Badge variant="outline" className="text-xs">
                    {unit}
                  </Badge>
                )}
                {year && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {year}
                  </div>
                )}
              </div>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
