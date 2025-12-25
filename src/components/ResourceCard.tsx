import { useState } from "react";
import { FileText, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResourcePreviewDialog } from "./ResourcePreviewDialog";

interface ResourceCardProps {
  id: number;
  title: string;
  fileUrl: string;
  year?: number | null;
  index: number;
}

export function ResourceCard({ id, title, fileUrl, year, index }: ResourceCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Card 
        className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md animate-fade-in cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={() => setPreviewOpen(true)}
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
              {year && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {year}
                </div>
              )}
            </div>
            <Eye className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>

      <ResourcePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={title}
        fileUrl={fileUrl}
      />
    </>
  );
}
