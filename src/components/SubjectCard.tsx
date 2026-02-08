import { Link } from "react-router-dom";
import { ChevronRight, FlaskConical } from "lucide-react";

interface SubjectCardProps {
  id: number;
  name: string;
  code: string;
  isLab: boolean;
  index?: number;
}

export function SubjectCard({ id, name, code, isLab }: SubjectCardProps) {
  return (
    <Link
      to={`/subject/${id}`}
      className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/40 hover:shadow-soft transition-all duration-200"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          {isLab ? (
            <FlaskConical className="h-4 w-4" />
          ) : (
            <span className="text-sm font-semibold">
              {code.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs text-muted-foreground mb-0.5">{code}</div>
          <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
            {name}
          </div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}
