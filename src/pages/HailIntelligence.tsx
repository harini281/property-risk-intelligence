import { CloudHail, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { InteractiveMap } from '../components/InteractiveMap';
import { ProgressBar, Badge, StatCard } from '../components/RiskMeter';
import { BarChart, LineChart } from '../components/Charts';
import { climateTrends, properties } from '../data/mockData';

const hailEvents = [
  { date: '2024-06-28', size: '1.75"', location: 'Kalamazoo, MI', damage: '$45,000' },
  { date: '2023-07-04', size: '2.00"', location: 'Lansing, MI', damage: '$120,000' },
  { date: '2021-08-25', size: '1.50"', location: 'Pontiac, MI', damage: '$67,000' },
  { date: '2020-06-10', size: '1.25"', location: 'Monroe, MI', damage: '$580,000' },
  { date: '2018-05-15', size: '1.00"', location: 'Ann Arbor, MI', damage: '$22,000' },
];

export default function HailIntelligence() {
  const markers = properties.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.address,
    value: p.risks.hail,
  }));

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Hail Intelligence' }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Hail Intelligence</h1>
          <p className="text-sm text-ink-500 mt-1">Hail risk analysis, historical events, and damage assessment</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Avg Hail Risk" value="72" icon={<CloudHail className="w-5 h-5" />} trend="12%" trendUp={false} />
          <StatCard label="Events (5yr)" value="22" icon={<TrendingUp className="w-5 h-5" />} color="text-risk-medium" />
          <StatCard label="Max Hail Size" value='2.0"' icon={<AlertTriangle className="w-5 h-5" />} color="text-risk-high" />
          <StatCard label="Total Damage" value="$834K" icon={<AlertTriangle className="w-5 h-5" />} color="text-risk-high" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Hail Events Trend" subtitle="Annual hail events since 1995" icon={<TrendingUp className="w-5 h-5" />} />
            <LineChart data={climateTrends.hailEvents} color="#a855f7" height={220} yLabel="Events" />
          </Card>

          <Card>
            <CardHeader title="Hail Risk by Property" subtitle="Current portfolio" />
            <BarChart
              data={properties.map((p) => ({ label: p.address.split(' ')[0], value: p.risks.hail }))}
              height={220}
            />
          </Card>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-ink-200/60">
            <h3 className="text-sm font-semibold text-ink-900">Hail Risk Map</h3>
          </div>
          <InteractiveMap markers={markers} showLayers={false} height="h-80" />
        </Card>

        <Card>
          <CardHeader title="Historical Hail Events" subtitle="NOAA-verified hail reports" icon={<CloudHail className="w-5 h-5" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs text-ink-500 uppercase tracking-wide">
                  <th className="pb-2 pr-4 font-medium">Date</th>
                  <th className="pb-2 pr-4 font-medium">Hail Size</th>
                  <th className="pb-2 pr-4 font-medium">Location</th>
                  <th className="pb-2 pr-4 font-medium">Damage</th>
                </tr>
              </thead>
              <tbody>
                {hailEvents.map((e, i) => (
                  <tr key={i} className="border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors">
                    <td className="py-3 pr-4 text-ink-700">{e.date}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={parseFloat(e.size) >= 1.5 ? 'high' : 'medium'}>{e.size}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-ink-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-ink-400" /> {e.location}
                    </td>
                    <td className="py-3 pr-4 font-medium text-ink-900">{e.damage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Hail Mitigation Recommendations" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Roof', value: 85, text: 'Install Class 4 impact-resistant shingles' },
              { label: 'Skylights', value: 60, text: 'Add protective skylight covers' },
              { label: 'AC Units', value: 70, text: 'Install hail guards on outdoor equipment' },
              { label: 'Vehicles', value: 45, text: 'Ensure covered parking availability' },
            ].map((r) => (
              <div key={r.label} className="p-3 bg-ink-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink-700">{r.label}</span>
                  <span className="text-xs font-bold text-ink-900">{r.value}%</span>
                </div>
                <ProgressBar value={r.value} />
                <p className="text-xs text-ink-500 mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
