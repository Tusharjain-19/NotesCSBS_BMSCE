import { Link } from "react-router-dom";
import { FlaskConical, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubjectCardProps {
  id: number;
  name: string;
  code: string;
  isLab: boolean;
  index: number;
}

export function SubjectCard({ id, name, code, isLab, index }: SubjectCardProps) {
  return (
    <Link to={`/subject/${id}`}>
      <Card 
        className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg animate-fade-in"
        style={{ animationDelay: `${index * 75}ms` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110">
                  {isLab ? <FlaskConical className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </div>
                <Badge variant={isLab ? "secondary" : "outline"} className="text-xs">
                  {code}
                </Badge>
              </div>
              <h3 className="font-medium text-foreground leading-tight line-clamp-2">
                {name}
              </h3>
            </div>
            {isLab && (
              <Badge variant="default" className="shrink-0 text-xs bg-primary/20 text-primary border-0">
                Lab
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
