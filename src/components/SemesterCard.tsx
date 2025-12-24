import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, FileText, Beaker } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SemesterCardProps {
  id: number;
  name: string;
  order: number;
  index: number;
}

const semesterIcons = [BookOpen, GraduationCap, FileText, Beaker];

export function SemesterCard({ id, name, order, index }: SemesterCardProps) {
  const Icon = semesterIcons[index % semesterIcons.length];
  
  return (
    <Link to={`/semester/${id}`}>
      <Card 
        className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative flex flex-col items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
            <Icon className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              View all subjects
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
