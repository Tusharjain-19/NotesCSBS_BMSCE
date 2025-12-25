import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, Code, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ResourcePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fileUrl: string;
}

// Extract Google Drive file ID from various URL formats
function extractDriveFileId(url: string): string | null {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return openMatch[1];

  const docsMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch) return docsMatch[1];

  return null;
}

function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split('.').pop()?.toLowerCase() || '';
    return ext;
  } catch {
    return url.split('.').pop()?.toLowerCase() || '';
  }
}

function getFileType(url: string): 'google-drive' | 'pdf' | 'video' | 'image' | 'text' | 'office' | 'unknown' {
  if (extractDriveFileId(url)) return 'google-drive';
  
  const ext = getFileExtension(url);
  
  // PDF
  if (ext === 'pdf') return 'pdf';
  
  // Video
  if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) return 'video';
  
  // Image
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
  
  // Text/Code files
  if (['txt', 'md', 'c', 'cpp', 'h', 'py', 'js', 'ts', 'jsx', 'tsx', 'java', 'css', 'html', 'json', 'xml', 'yaml', 'yml', 'sh', 'sql', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'scala', 'r', 'matlab', 'm', 'vhdl', 'v', 'asm', 's'].includes(ext)) return 'text';
  
  // Office documents (use Google Docs viewer)
  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'odt', 'ods', 'odp'].includes(ext)) return 'office';
  
  return 'unknown';
}

function getEmbedUrl(url: string): string {
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

function getDownloadUrl(url: string): string {
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

function getGoogleDocsViewerUrl(url: string): string {
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
}

function TextPreview({ url, title }: { url: string; title: string }) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch file');
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError('Unable to load file content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [url]);

  const ext = getFileExtension(url);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-muted/50">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
        <Code className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground font-mono">{title}</span>
      </div>
      <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words text-foreground">
        {content}
      </pre>
    </div>
  );
}

export function ResourcePreviewDialog({ 
  open, 
  onOpenChange, 
  title, 
  fileUrl 
}: ResourcePreviewDialogProps) {
  const fileType = getFileType(fileUrl);
  const embedUrl = getEmbedUrl(fileUrl);
  const downloadUrl = getDownloadUrl(fileUrl);

  const renderPreview = () => {
    switch (fileType) {
      case 'google-drive':
        return (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={title}
          />
        );
      
      case 'pdf':
        return (
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={title}
          />
        );
      
      case 'video':
        return (
          <div className="flex items-center justify-center h-full bg-black">
            <video
              src={fileUrl}
              controls
              className="max-w-full max-h-full"
              title={title}
            >
              Your browser does not support video playback.
            </video>
          </div>
        );
      
      case 'image':
        return (
          <div className="flex items-center justify-center h-full p-4 bg-muted/30">
            <img
              src={fileUrl}
              alt={title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      
      case 'text':
        return <TextPreview url={fileUrl} title={title} />;
      
      case 'office':
        return (
          <iframe
            src={getGoogleDocsViewerUrl(fileUrl)}
            className="w-full h-full border-0"
            title={title}
          />
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
        );
    }
  };

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
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}