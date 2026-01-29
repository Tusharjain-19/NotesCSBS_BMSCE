import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";

interface TimeseriesData {
  date: string;
  visitors: number;
  pageviews: number;
}

interface AnalyticsChartProps {
  data: TimeseriesData[];
  isLoading?: boolean;
}

export function AnalyticsChart({ data, isLoading }: AnalyticsChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM d"),
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="area">Area Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Visitors"
                  />
                  <Line
                    type="monotone"
                    dataKey="pageviews"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    name="Page Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="area" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                    name="Visitors"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageviews"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2) / 0.2)"
                    strokeWidth={2}
                    name="Page Views"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
