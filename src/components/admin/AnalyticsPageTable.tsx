import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface PageData {
  path: string;
  views: number;
  visitors?: number;
  avgDuration?: number;
  bounceRate?: number;
}

interface AnalyticsPageTableProps {
  data: PageData[];
  isLoading?: boolean;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export function AnalyticsPageTable({ data, isLoading }: AnalyticsPageTableProps) {
  const maxViews = data.length > 0 ? Math.max(...data.map((p) => p.views)) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No page data available for the selected period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 10).map((page, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm truncate flex-1 mr-4">
                  {page.path}
                </span>
                <span className="text-sm font-medium text-foreground shrink-0">
                  {page.views.toLocaleString()} views
                </span>
              </div>
              <Progress
                value={(page.views / maxViews) * 100}
                className="h-1.5"
              />
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                {page.visitors !== undefined && (
                  <span>{page.visitors.toLocaleString()} visitors</span>
                )}
                {page.avgDuration !== undefined && (
                  <span>Avg: {formatDuration(page.avgDuration)}</span>
                )}
                {page.bounceRate !== undefined && (
                  <span>Bounce: {page.bounceRate}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}