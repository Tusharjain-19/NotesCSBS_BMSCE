import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

interface ResourcePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fileUrl: string;
}

// Extract Google Drive file ID from various URL formats
function extractDriveFileId(url: string): string | null {
  // Format: https://drive.google.com/file/d/{FILE_ID}/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // Format: https://drive.google.com/open?id={FILE_ID}
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return openMatch[1];

  // Format: https://docs.google.com/presentation/d/{FILE_ID}/edit
  const docsMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch) return docsMatch[1];

  return null;
}

function getEmbedUrl(url: string): string {
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  // If not a Google Drive URL, return as-is
  return url;
}

function getDownloadUrl(url: string): string {
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

export function ResourcePreviewDialog({ 
  open, 
  onOpenChange, 
  title, 
  fileUrl 
}: ResourcePreviewDialogProps) {
  const embedUrl = getEmbedUrl(fileUrl);
  const downloadUrl = getDownloadUrl(fileUrl);
  const isGoogleDrive = extractDriveFileId(fileUrl) !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-semibold truncate pr-8">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={downloadUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 bg-muted/30">
          {isGoogleDrive ? (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={title}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <p className="text-muted-foreground mb-4">
                  Preview not available for this file type.
                </p>
                <Button asChild>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
