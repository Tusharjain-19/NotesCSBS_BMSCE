import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { toast } from "sonner";

interface ExportableData {
  visitors: number;
  pageviews: number;
  avg_duration_seconds: number;
  bounce_rate: number;
  current_visitors: number;
  top_pages: { path: string; views: number }[];
  timeseries: { date: string; visitors: number; pageviews: number }[];
  sources: { source: string; visitors: number }[];
  devices: { device: string; visitors: number; percentage: number }[];
  geo: { country: string; visitors: number; cities?: { city: string; visitors: number }[] }[];
}

interface AnalyticsExportProps {
  data: ExportableData | null;
  dateRange: { startDate: string; endDate: string };
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toCSV(data: ExportableData, dateRange: { startDate: string; endDate: string }): string {
  const lines: string[] = [];

  lines.push("Analytics Report");
  lines.push(`Date Range,${dateRange.startDate},${dateRange.endDate}`);
  lines.push("");

  // Summary
  lines.push("Metric,Value");
  lines.push(`Total Visitors,${data.visitors}`);
  lines.push(`Current Visitors,${data.current_visitors}`);
  lines.push(`Page Views,${data.pageviews}`);
  lines.push(`Avg Duration (seconds),${data.avg_duration_seconds}`);
  lines.push(`Bounce Rate (%),${data.bounce_rate}`);
  lines.push("");

  // Timeseries
  lines.push("Date,Visitors,Page Views");
  data.timeseries.forEach((t) => lines.push(`${t.date},${t.visitors},${t.pageviews}`));
  lines.push("");

  // Top Pages
  lines.push("Page,Views");
  data.top_pages.forEach((p) => lines.push(`"${p.path}",${p.views}`));
  lines.push("");

  // Sources
  lines.push("Source,Visitors");
  data.sources.forEach((s) => lines.push(`${s.source},${s.visitors}`));
  lines.push("");

  // Devices
  lines.push("Device,Visitors,Percentage");
  data.devices.forEach((d) => lines.push(`${d.device},${d.visitors},${d.percentage}%`));
  lines.push("");

  // Geo
  lines.push("Country,Visitors");
  data.geo.forEach((g) => lines.push(`${g.country},${g.visitors}`));

  return lines.join("\n");
}

export function AnalyticsExport({ data, dateRange }: AnalyticsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: "csv" | "json") => {
    if (!data) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      if (format === "csv") {
        const csv = toCSV(data, dateRange);
        downloadFile(csv, `analytics-${timestamp}.csv`, "text/csv");
      } else {
        const json = JSON.stringify({ dateRange, ...data }, null, 2);
        downloadFile(json, `analytics-${timestamp}.json`, "application/json");
      }
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Failed to export analytics");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!data || isExporting}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
