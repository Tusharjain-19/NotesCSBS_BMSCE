import { useState } from "react";
import { format, subDays, subHours } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DatePreset = "24h" | "7d" | "30d" | "60d" | "90d" | "all" | "custom";

interface DateRange {
  from: Date;
  to: Date;
}

interface AnalyticsDateFilterProps {
  onDateChange: (startDate: string, endDate: string, granularity: string) => void;
}

export function AnalyticsDateFilter({ onDateChange }: AnalyticsDateFilterProps) {
  const [preset, setPreset] = useState<DatePreset>("7d");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);
    
    const now = new Date();
    let startDate: Date;
    let endDate = now;
    let granularity = "daily";

    switch (newPreset) {
      case "24h":
        startDate = subHours(now, 24);
        granularity = "hourly";
        break;
      case "7d":
        startDate = subDays(now, 7);
        break;
      case "30d":
        startDate = subDays(now, 30);
        break;
      case "60d":
        startDate = subDays(now, 60);
        break;
      case "90d":
        startDate = subDays(now, 90);
        break;
      case "all":
        startDate = new Date("2020-01-01");
        break;
      case "custom":
        startDate = customRange.from;
        endDate = customRange.to;
        break;
      default:
        startDate = subDays(now, 7);
    }

    onDateChange(
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd"),
      granularity
    );
  };

  const handleCustomDateSelect = (date: Date | undefined, type: "from" | "to") => {
    if (!date) return;
    
    const newRange = { ...customRange, [type]: date };
    setCustomRange(newRange);
    
    if (preset === "custom") {
      onDateChange(
        format(newRange.from, "yyyy-MM-dd"),
        format(newRange.to, "yyyy-MM-dd"),
        "daily"
      );
    }
  };

  const presets: { value: DatePreset; label: string }[] = [
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "60d", label: "60 Days" },
    { value: "90d", label: "90 Days" },
    { value: "all", label: "All Time" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {presets.map((p) => (
          <Button
            key={p.value}
            variant={preset === p.value ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetChange(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
                  !customRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customRange.from && customRange.to ? (
                  <>
                    {format(customRange.from, "MMM d, yyyy")} -{" "}
                    {format(customRange.to, "MMM d, yyyy")}
                  </>
                ) : (
                  <span>Pick dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex">
                <div className="border-r p-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-2">From</p>
                  <Calendar
                    mode="single"
                    selected={customRange.from}
                    onSelect={(date) => handleCustomDateSelect(date, "from")}
                    disabled={(date) => date > new Date() || date > customRange.to}
                    initialFocus
                    className={cn("p-2 pointer-events-auto")}
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-2">To</p>
                  <Calendar
                    mode="single"
                    selected={customRange.to}
                    onSelect={(date) => handleCustomDateSelect(date, "to")}
                    disabled={(date) => date > new Date() || date < customRange.from}
                    className={cn("p-2 pointer-events-auto")}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
