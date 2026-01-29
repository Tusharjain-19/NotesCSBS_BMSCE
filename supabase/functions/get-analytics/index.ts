import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface AnalyticsData {
  visitors: number;
  pageviews: number;
  avg_duration_seconds: number;
  bounce_rate: number;
  top_pages: { path: string; views: number }[];
  timeseries: { date: string; visitors: number; pageviews: number }[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const granularity = url.searchParams.get('granularity') || 'daily';

    console.log(`Fetching analytics: startDate=${startDate}, endDate=${endDate}, granularity=${granularity}`);

    // Get the internal analytics API URL
    const projectId = Deno.env.get('SUPABASE_PROJECT_ID') || 'xqlvzzfyspbbpghjoeue';
    const analyticsUrl = `https://api.lovable.dev/v1/projects/${projectId}/analytics`;
    
    // Build query params
    const params = new URLSearchParams();
    if (startDate) params.set('startdate', startDate);
    if (endDate) params.set('enddate', endDate);
    params.set('granularity', granularity);

    const response = await fetch(`${analyticsUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Analytics API returned ${response.status}: ${await response.text()}`);
      throw new Error(`Failed to fetch analytics: ${response.status}`);
    }

    const rawData = await response.json();
    console.log('Raw analytics response:', JSON.stringify(rawData).slice(0, 500));

    // Process and format the data
    const analyticsData: AnalyticsData = {
      visitors: rawData.visitors || 0,
      pageviews: rawData.pageviews || 0,
      avg_duration_seconds: rawData.avg_duration_seconds || 0,
      bounce_rate: rawData.bounce_rate || 0,
      top_pages: rawData.top_pages || [],
      timeseries: rawData.timeseries || [],
    };

    return new Response(JSON.stringify(analyticsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Error in get-analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
