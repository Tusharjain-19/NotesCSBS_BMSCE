

# Admin Analytics Dashboard Implementation Plan

## Overview
Add a comprehensive analytics dashboard to the Admin panel that displays visitor statistics, page views, visit duration, and bounce rate with interactive charts and flexible date filtering.

## Features to Implement

### 1. Analytics Dashboard Tab
- Add a new "Analytics" tab to the Admin panel using the existing Tabs component
- Create a dedicated section showing key metrics with visual graphs

### 2. Key Metrics Cards
Display the following statistics in summary cards:
- **Total Visitors** - Number of unique visitors
- **Page Views** - Total page views across the site
- **Avg Visit Duration** - Average session duration in readable format (e.g., "3m 49s")
- **Bounce Rate** - Percentage of single-page visits

### 3. Date Range Filter
Add flexible filtering with preset options and custom date range:
- **24 Hours** - Last 24 hours of data (hourly granularity)
- **7 Days** - Last 7 days (daily granularity)
- **30 Days** - Last 30 days (daily granularity)
- **All Time** - All available data (daily granularity)
- **Custom** - Date range picker for custom start/end dates

### 4. Charts and Visualizations
Using the existing Recharts library:
- **Line Chart** for visitors and page views over time
- **Area Chart** for session duration trends
- **Bar Chart** for bounce rate visualization
- Toggle between different chart views

### 5. Top Pages Table
Display the most visited pages with view counts (data already available from analytics API)

## Technical Implementation

### New Component Structure
```text
src/components/admin/
  AnalyticsDashboard.tsx    <- Main analytics component
  AnalyticsDateFilter.tsx   <- Date filter with presets and custom range
  AnalyticsChart.tsx        <- Chart wrapper for different visualizations
  AnalyticsMetricCard.tsx   <- Individual metric display card
```

### Data Fetching
- Create an edge function `get-analytics` to fetch analytics data
- The edge function will call the internal analytics API and return formatted data
- Support date range and granularity parameters

### Admin Page Updates
- Add Analytics tab to the existing Admin page tabs
- Import and render the AnalyticsDashboard component

## User Interface Design

```text
+----------------------------------------------------------+
|  Admin Panel                               [Sign Out]     |
+----------------------------------------------------------+
|  [Resources]  [Analytics]                                 |
+----------------------------------------------------------+
|                                                           |
|  Date Filter: [24h] [7 Days] [30 Days] [All Time] [Custom]|
|               [Jan 15, 2026] - [Jan 29, 2026] (if custom) |
|                                                           |
|  +------------+ +------------+ +------------+ +---------+ |
|  | Visitors   | | Page Views | | Duration   | | Bounce  | |
|  |    306     | |   1,071    | |   3m 49s   | |   22%   | |
|  +------------+ +------------+ +------------+ +---------+ |
|                                                           |
|  [Chart: Visitors & Page Views Over Time]                 |
|                                                           |
|  +------------------------------------------------------+ |
|  |     Line/Area chart showing trends over selected     | |
|  |     date range with tooltips on hover                | |
|  +------------------------------------------------------+ |
|                                                           |
|  Top Pages:                                               |
|  +------------------------------------------------------+ |
|  | /semester/3          | 217 views                     | |
|  | /                    | 164 views                     | |
|  | /subject/11          | 133 views                     | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/admin/AnalyticsDashboard.tsx` | Create | Main analytics dashboard component |
| `src/components/admin/AnalyticsDateFilter.tsx` | Create | Date range filter with presets |
| `supabase/functions/get-analytics/index.ts` | Create | Edge function to fetch analytics |
| `supabase/config.toml` | Modify | Add the new edge function configuration |
| `src/pages/Admin.tsx` | Modify | Add Analytics tab and import dashboard |

## Dependencies
All required packages are already installed:
- `recharts` - For charts
- `date-fns` - For date formatting and calculations
- `react-day-picker` - For calendar date picker

## Edge Function Implementation
The `get-analytics` edge function will:
1. Accept query parameters: `startDate`, `endDate`, `granularity`
2. Make an internal request to fetch analytics data
3. Return formatted JSON with visitors, pageviews, duration, bounce rate, and top pages
4. Handle CORS for frontend access

