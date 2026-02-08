import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GeoData {
  country: string;
  visitors: number;
  cities?: { city: string; visitors: number }[];
}

interface AnalyticsGeoChartProps {
  data: GeoData[];
  isLoading: boolean;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--chart-2) / 0.6)",
  "hsl(var(--chart-3) / 0.6)",
];

export function AnalyticsGeoChart({ data, isLoading }: AnalyticsGeoChartProps) {
  const totalVisitors = data.reduce((sum, d) => sum + d.visitors, 0);

  // Flatten all cities from all countries
  const allCities = data.flatMap(
    (country) =>
      country.cities?.map((c) => ({
        ...c,
        country: country.country,
      })) || []
  ).sort((a, b) => b.visitors - a.visitors).slice(0, 10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-5 w-5 text-primary" />
          Geographic Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="countries">
          <TabsList className="mb-4">
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
          </TabsList>

          <TabsContent value="countries">
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ left: 80 }}>
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="country"
                    tick={{ fontSize: 12 }}
                    width={75}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [
                      `${value} visitors (${totalVisitors ? ((value / totalVisitors) * 100).toFixed(1) : 0}%)`,
                      "Visitors",
                    ]}
                  />
                  <Bar dataKey="visitors" radius={[0, 4, 4, 0]}>
                    {data.slice(0, 8).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Country list */}
              <div className="space-y-2">
                {data.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{item.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${totalVisitors ? (item.visitors / totalVisitors) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground w-16 text-right">
                        {item.visitors}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cities">
            {allCities.length > 0 ? (
              <div className="space-y-2">
                {allCities.map((city, i) => {
                  const maxCityVisitors = allCities[0]?.visitors || 1;
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">{city.city}</span>
                        <span className="text-xs text-muted-foreground">({city.country})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `${(city.visitors / maxCityVisitors) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-muted-foreground w-16 text-right">
                          {city.visitors}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No city-level data available
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
