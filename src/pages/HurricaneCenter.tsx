import { CloudLightning, Wind, Gauge, AlertTriangle, TrendingUp } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { InteractiveMap } from '../components/InteractiveMap';
import { ProgressBar, Badge, StatCard } from '../components/RiskMeter';
import { LineChart } from '../components/Charts';

const hurricaneHistory = [
  { year: 2024, name: '—', category: 'N/A', closest: '420 mi', impact: 'Minimal' },
  { year: 2023, name: '—', category: 'N/A', closest: '380 mi', impact: 'Minimal' },
  { year: 2021, name: 'Fred (remnant)', category: 'Tropical Storm', closest: '180 mi', impact: 'Heavy rain' },
  { year: 2020, name: 'Isaias (remnant)', category: 'Tropical Storm', closest: '220 mi', impact: 'Wind damage' },
  { year: 2012, name: 'Sandy (remnant)', category: 'Post-Tropical', closest: '95 mi', impact: 'Major wind/rain' },
];

export default function HurricaneCenter() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Hurricane Center' }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Hurricane Center</h1>
          <p className="text-sm text-ink-500 mt-1">Hurricane tracking, historical impacts, and tropical storm analysis</p>
        </div>

        {/* Status banner */}
        <div className="card p-5 bg-gradient-to-r from-brand-50 to-white border-brand-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
              <CloudLightning className="w-6 h-6 text-brand-600 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink-900">No Active Hurricanes</h3>
              <p className="text-xs text-ink-500 mt-0.5">No tropical systems currently affecting Michigan. Last remnant impact: 2021 (Tropical Storm Fred)</p>
            </div>
            <Badge variant="low" className="ml-auto">All Clear</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Current Risk" value="3" icon={<CloudLightning className="w-5 h-5" />} color="text-risk-low" />
          <StatCard label="Events (30yr)" value="5" icon={<TrendingUp className="w-5 h-5" />} color="text-brand-500" />
          <StatCard label="Max Wind Gust" value="81 mph" icon={<Wind className="w-5 h-5" />} color="text-risk-medium" />
          <StatCard label="Avg Pressure" value="29.92" icon={<Gauge className="w-5 h-5" />} color="text-brand-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Wind Risk Trend" subtitle="Annual max wind speeds" icon={<Wind className="w-5 h-5" />} />
            <LineChart
              data={[
                { year: 2015, value: 65 },
                { year: 2017, value: 72 },
                { year: 2019, value: 68 },
                { year: 2021, value: 75 },
                { year: 2023, value: 81 },
                { year: 2024, value: 78 },
              ]}
              color="#f59e0b"
              height={220}
              yLabel="mph"
            />
          </Card>

          <Card>
            <CardHeader title="Hurricane Impact Risk" subtitle="Regional vulnerability" icon={<AlertTriangle className="w-5 h-5" />} />
            <div className="space-y-4">
              {[
                { label: 'Direct Hurricane Impact', value: 2 },
                { label: 'Remnant Tropical Storm', value: 18 },
                { label: 'Wind Damage from Remnants', value: 35 },
                { label: 'Heavy Rainfall from Remnants', value: 42 },
                { label: 'Power Outage Risk', value: 28 },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink-700">{r.label}</span>
                    <span className="text-sm font-semibold text-ink-900">{r.value}%</span>
                  </div>
                  <ProgressBar value={r.value} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-ink-200/60">
            <h3 className="text-sm font-semibold text-ink-900">Storm Track Map</h3>
          </div>
          <InteractiveMap
            markers={[
              { id: 'h1', lat: 42.3, lng: -83.7, label: 'Ann Arbor', value: 3 },
              { id: 'h2', lat: 41.9, lng: -83.5, label: 'Monroe', value: 5 },
            ]}
            showLayers={false}
            height="h-72"
          />
        </Card>

        <Card>
          <CardHeader title="Historical Hurricane Impacts" subtitle="Remnant systems affecting Michigan" icon={<CloudLightning className="w-5 h-5" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs text-ink-500 uppercase tracking-wide">
                  <th className="pb-2 pr-4 font-medium">Year</th>
                  <th className="pb-2 pr-4 font-medium">System</th>
                  <th className="pb-2 pr-4 font-medium">Category</th>
                  <th className="pb-2 pr-4 font-medium">Closest Approach</th>
                  <th className="pb-2 pr-4 font-medium">Impact</th>
                </tr>
              </thead>
              <tbody>
                {hurricaneHistory.map((h, i) => (
                  <tr key={i} className="border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors">
                    <td className="py-3 pr-4 text-ink-700">{h.year}</td>
                    <td className="py-3 pr-4 font-medium text-ink-900">{h.name}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={h.category === 'N/A' ? 'neutral' : h.category.includes('Tropical') ? 'medium' : 'high'}>
                        {h.category}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-ink-700">{h.closest}</td>
                    <td className="py-3 pr-4 text-ink-700">{h.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
