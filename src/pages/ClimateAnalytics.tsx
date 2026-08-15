import {
  CloudRain,
  Zap,
  Waves,
  Snowflake,
  Flame,
  TrendingUp,
  Thermometer,
  AlertTriangle,
  ArrowUpRight,
  Leaf,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { LineChart } from '../components/Charts';
import { Badge, StatCard } from '../components/RiskMeter';
import { climateTrends } from '../data/mockData';

const breadcrumbs = [
  { label: 'Dashboard', to: '/app' },
  { label: 'Climate Analytics' },
];

interface ChartConfig {
  key: keyof typeof climateTrends;
  title: string;
  yLabel: string;
  color: string;
  trend: string;
  icon: typeof CloudRain;
}

const charts: ChartConfig[] = [
  { key: 'rainfall', title: 'Rainfall', yLabel: 'in/yr', color: '#3b82f6', trend: '+36%', icon: CloudRain },
  { key: 'stormFrequency', title: 'Storm Frequency', yLabel: 'events/yr', color: '#f59e0b', trend: '+117%', icon: Zap },
  { key: 'floodEvents', title: 'Flood Events', yLabel: 'per year', color: '#06b6d4', trend: '+267%', icon: Waves },
  { key: 'hailEvents', title: 'Hail Events', yLabel: 'per year', color: '#a855f7', trend: '+175%', icon: Snowflake },
  { key: 'heatWaves', title: 'Heat Waves', yLabel: 'per year', color: '#ef4444', trend: '+400%', icon: Flame },
  { key: 'freezeDates', title: 'Freeze-Free Days', yLabel: 'days/yr', color: '#22c55e', trend: '+22%', icon: Leaf },
];

const projections = [
  {
    icon: CloudRain,
    color: 'text-brand-600',
    text: 'Annual rainfall is projected to rise another 12–18% by 2050, increasing the frequency of localized flash flooding across the Great Lakes basin.',
  },
  {
    icon: Zap,
    color: 'text-amber-600',
    text: 'Severe storm frequency is expected to double by 2040, with convective wind and hail events shifting northward into previously low-risk zones.',
  },
  {
    icon: Flame,
    color: 'text-red-600',
    text: 'Heat-wave days could triple by 2055 under high-emission scenarios, driving up cooling demand and drought-related subsidence risk for properties.',
  },
  {
    icon: Waves,
    color: 'text-cyan-600',
    text: 'Flood-event recurrence intervals are shortening — what was a 100-year flood plain in 1995 now behaves like a 30-year flood plain, materially impacting property valuations.',
  },
];

export default function ClimateAnalytics() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Climate Analytics</h1>
            <p className="text-sm text-ink-500 mt-0.5">
              30-year weather trend analysis and climate risk projections
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Rainfall Increase"
          value="+36%"
          icon={<CloudRain className="w-5 h-5" />}
          trend="36%"
          trendUp
          color="text-brand-600"
        />
        <StatCard
          label="Storm Frequency"
          value="+117%"
          icon={<Zap className="w-5 h-5" />}
          trend="117%"
          trendUp
          color="text-amber-600"
        />
        <StatCard
          label="Flood Events"
          value="+267%"
          icon={<Waves className="w-5 h-5" />}
          trend="267%"
          trendUp
          color="text-cyan-600"
        />
        <StatCard
          label="Heat Waves"
          value="+400%"
          icon={<Flame className="w-5 h-5" />}
          trend="400%"
          trendUp
          color="text-red-600"
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {charts.map((chart) => {
          const Icon = chart.icon;
          return (
            <Card key={chart.key}>
              <CardHeader
                title={chart.title}
                icon={<Icon className="w-5 h-5" />}
                action={
                  <Badge variant="high" className="inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {chart.trend}
                  </Badge>
                }
              />
              <LineChart
                data={climateTrends[chart.key]}
                color={chart.color}
                height={220}
                yLabel={chart.yLabel}
              />
            </Card>
          );
        })}
      </div>

      {/* Climate projections */}
      <Card>
        <CardHeader
          title="Climate Projections"
          subtitle="Modeled 2050 outlook and risk implications"
          icon={<AlertTriangle className="w-5 h-5" />}
          action={
            <Badge variant="brand" className="inline-flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              2050 Outlook
            </Badge>
          }
        />
        <ul className="space-y-4">
          {projections.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-ink-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className={`w-4 h-4 ${p.color}`} />
                </div>
                <p className="text-sm text-ink-600 leading-relaxed">{p.text}</p>
              </li>
            );
          })}
        </ul>
      </Card>
    </AppLayout>
  );
}
