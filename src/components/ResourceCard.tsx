import { useState } from "react";
import { FileText, Download, ExternalLink, Calendar } from "lucide-react";
import { ResourcePreviewDialog } from "./ResourcePreviewDialog";

interface ResourceCardProps {
  id: number;
  title: string;
  fileUrl: string;
  year?: number | null;
  type?: string;
  compact?: boolean;
  index?: number;
}

const typeConfig: Record<string, { label: string; color: string }> = {
  "cie1": { label: "CIE-1", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "cie2": { label: "CIE-2", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "cie3": { label: "CIE-3", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
  "see": { label: "SEE", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "notes": { label: "Notes", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  "book": { label: "Book", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" }
};

export function ResourceCard({ title, fileUrl, year, type }: ResourceCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const typeInfo = type ? typeConfig[type] : null;

  return (
    <>
      <div 
        className="flex items-center justify-between border border-border bg-card px-4 py-3.5 rounded-lg hover:bg-accent/50 hover:border-primary/40 hover:shadow-soft transition-all duration-200 cursor-pointer group"
        onClick={() => setPreviewOpen(true)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {title}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded font-mono">
                PDF
              </span>
              {year && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {year}
                </span>
              )}
              {typeInfo && (
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="View"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <a
            href={fileUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4 text-muted-foreground group-hover:text-success transition-colors" />
          </a>
        </div>
      </div>

      <ResourcePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={title}
        fileUrl={fileUrl}
      />
    </>
  );
}
