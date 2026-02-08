import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface SemesterCardProps {
  id: number;
  name: string;
  order: number;
  index?: number;
}

export function SemesterCard({ id, name, order }: SemesterCardProps) {
  return (
    <Link
      to={`/semester/${id}`}
      className="group relative flex items-center justify-between p-6 rounded-xl border border-border bg-card hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 hover:border-primary/40 hover:shadow-soft-lg hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            {order}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              View subjects & resources
            </p>
          </div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
