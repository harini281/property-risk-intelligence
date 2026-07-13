import { useState } from 'react';
import {
  Waves, Mountain, Sailboat, Droplets, Anchor, History,
  Gauge, Zap, Home, Clock, ShieldAlert, MapPin,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { StatCard, Badge, ProgressBar, RiskMeter } from '../components/RiskMeter';
import { InteractiveMap, type MapMarker } from '../components/InteractiveMap';
import { BarChart } from '../components/Charts';

const mapLayers = [
  { id: 'flood', label: 'Flood Zones', color: '#06b6d4' },
  { id: 'radar', label: 'Weather Radar', color: '#3b82f6' },
  { id: 'storm', label: 'Storm Tracks', color: '#fbbf24' },
];

const floodMarkers: MapMarker[] = [
  { id: 'subject', lat: 42.28, lng: -83.72, label: 'Subject Property', color: '#2563eb', value: 48 },
  { id: 'river', lat: 42.27, lng: -83.7, label: 'Huron River', color: '#06b6d4' },
  { id: 'gauge', lat: 42.3, lng: -83.74, label: 'Stream Gauge', color: '#3b82f6' },
  { id: 'flood1', lat: 42.26, lng: -83.73, label: 'Flood Zone AE', color: '#0891b2' },
];

const severityVariant: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
  low: 'low',
  moderate: 'medium',
  high: 'high',
  severe: 'critical',
};

interface FloodEvent {
  date: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  peakCrest: string;
}

const historicalFloods: FloodEvent[] = [
  {
    date: 'May 2023',
    description: 'Heavy rainfall caused Huron River to crest 3.2 ft above flood stage, inundating low-lying areas near the subject property.',
    severity: 'severe',
    peakCrest: '9.1 ft',
  },
  {
    date: 'Jun 2021',
    description: 'Slow-moving thunderstorms dropped 4.7 inches of rain in 6 hours, triggering localized flash flooding across the watershed.',
    severity: 'high',
    peakCrest: '7.8 ft',
  },
  {
    date: 'Apr 2019',
    description: 'Spring snowmelt combined with steady precipitation raised river levels to moderate flood stage for 4 consecutive days.',
    severity: 'moderate',
    peakCrest: '6.4 ft',
  },
  {
    date: 'Aug 2017',
    description: 'Urban flash flood from a stalled convective system; storm drains overwhelmed in the drainage basin surrounding the property.',
    severity: 'high',
    peakCrest: '7.1 ft',
  },
  {
    date: 'Mar 2015',
    description: 'Ice jam breakup on the Huron River produced a rapid crest event and minor basement flooding in adjacent neighborhoods.',
    severity: 'moderate',
    peakCrest: '5.9 ft',
  },
  {
    date: 'Sep 2012',
    description: 'Remnants of a tropical system brought sustained rainfall; river exceeded flood stage briefly with minimal property impact.',
    severity: 'low',
    peakCrest: '5.2 ft',
  },
];

const monthlyPrecipitation = [
  { label: 'Jan', value: 1.8 },
  { label: 'Feb', value: 1.6 },
  { label: 'Mar', value: 2.4 },
  { label: 'Apr', value: 3.1 },
  { label: 'May', value: 3.6 },
  { label: 'Jun', value: 3.4 },
  { label: 'Jul', value: 2.9 },
  { label: 'Aug', value: 3.2 },
  { label: 'Sep', value: 3.0 },
  { label: 'Oct', value: 2.5 },
  { label: 'Nov', value: 2.2 },
  { label: 'Dec', value: 2.0 },
];

export default function FloodIntelligence() {
  const [activeLayer, setActiveLayer] = useState('flood');

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Flood Intelligence' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Flood Intelligence</h1>
            <p className="text-sm text-ink-500 mt-1">Comprehensive flood risk analysis and watershed data</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="brand">
              <Droplets className="w-3 h-3" /> FEMA Zone AE
            </Badge>
            <Badge variant="medium">
              <Gauge className="w-3 h-3" /> Moderate Risk
            </Badge>
          </div>
        </div>

        {/* Flood Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Flood Zone"
            value="Zone AE"
            icon={<Waves className="w-5 h-5" />}
            color="text-cyan-600"
          />
          <StatCard
            label="Elevation"
            value="612 ft"
            icon={<Mountain className="w-5 h-5" />}
            color="text-brand-600"
          />
          <StatCard
            label="Nearest River"
            value="0.3 mi"
            icon={<Sailboat className="w-5 h-5" />}
            color="text-cyan-600"
            trend="Huron River"
            trendUp={false}
          />
          <StatCard
            label="Watershed"
            value="Huron River"
            icon={<Droplets className="w-5 h-5" />}
            color="text-brand-600"
          />
          <StatCard
            label="Drainage Basin"
            value="Lake Erie"
            icon={<Anchor className="w-5 h-5" />}
            color="text-cyan-600"
          />
          <StatCard
            label="Historical Floods"
            value="12 events"
            icon={<History className="w-5 h-5" />}
            color="text-brand-600"
          />
        </div>

        {/* Risk Meter + Additional Risk Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flood Risk Meter */}
          <Card>
            <CardHeader
              title="Flood Risk Score"
              subtitle="Composite flood vulnerability index"
              icon={<Gauge className="w-5 h-5" />}
            />
            <div className="flex flex-col items-center justify-center py-4">
              <RiskMeter score={48} label="Moderate" size="lg" />
              <p className="text-xs text-ink-500 mt-4 text-center max-w-xs">
                Based on FEMA flood zone, elevation, proximity to water, drainage, and historical event frequency.
              </p>
            </div>
          </Card>

          {/* Additional Risk Metrics */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Detailed Risk Metrics"
              subtitle="Granular flood risk breakdown"
              icon={<ShieldAlert className="w-5 h-5" />}
            />
            <div className="space-y-5">
              <ProgressBar
                label="Flash Flood Probability"
                value={34}
                showValue
                color="bg-cyan-500"
              />
              <ProgressBar
                label="Basement Flood Risk"
                value={58}
                showValue
                color="bg-brand-500"
              />
              <ProgressBar
                label="Standing Water History"
                value={22}
                showValue
                color="bg-cyan-600"
              />
              <ProgressBar
                label="Foundation Seepage Risk"
                value={41}
                showValue
                color="bg-blue-500"
              />
            </div>
          </Card>
        </div>

        {/* Interactive Flood Map + Precipitation Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-0 overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between p-4 border-b border-ink-200/60">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Interactive Flood Map</h3>
                <p className="text-xs text-ink-500">Flood zones, waterways, and monitoring points</p>
              </div>
              <Badge variant="brand">
                <MapPin className="w-3 h-3" /> 4 points
              </Badge>
            </div>
            <InteractiveMap
              markers={floodMarkers}
              layers={mapLayers}
              activeLayer={activeLayer}
              onLayerChange={setActiveLayer}
              height="h-[400px]"
            />
          </Card>

          <Card>
            <CardHeader
              title="Monthly Precipitation"
              subtitle="10-year average (inches)"
              icon={<Droplets className="w-5 h-5" />}
            />
            <BarChart
              data={monthlyPrecipitation.map((m) => ({
                ...m,
                color: m.value >= 3 ? '#06b6d4' : '#3b82f6',
              }))}
              height={240}
            />
            <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xs text-ink-500">Wettest Month</p>
                <p className="text-sm font-semibold text-ink-900 mt-0.5">May — 3.6 in</p>
              </div>
              <div>
                <p className="text-xs text-ink-500">Annual Total</p>
                <p className="text-sm font-semibold text-ink-900 mt-0.5">31.7 in</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Historical Flood Events Timeline */}
        <Card>
          <CardHeader
            title="Historical Flood Events"
            subtitle="Documented flood events near the subject property"
            icon={<History className="w-5 h-5" />}
            action={<Badge variant="neutral">12 total events</Badge>}
          />
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-400 via-brand-500 to-blue-300" />

            <div className="space-y-5">
              {historicalFloods.map((event) => (
                <div key={event.date} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center shadow-sm">
                    <Droplets className="w-2.5 h-2.5 text-brand-600" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-ink-900">{event.date}</span>
                        <Badge variant={severityVariant[event.severity]}>
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">{event.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-500 sm:ml-4 shrink-0">
                      <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Peak crest: <span className="font-semibold text-ink-700">{event.peakCrest}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Risk Factor Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader
              title="Flash Flood"
              subtitle="Rapid onset flooding potential"
              icon={<Zap className="w-5 h-5" />}
            />
            <div className="flex items-center gap-3">
              <RiskMeter score={34} size="sm" showLabel={false} />
              <div>
                <p className="text-2xl font-bold text-ink-900">34%</p>
                <p className="text-xs text-ink-500">probability / 24h storm</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Basement Flood"
              subtitle="Interior water intrusion risk"
              icon={<Home className="w-5 h-5" />}
            />
            <div className="flex items-center gap-3">
              <RiskMeter score={58} size="sm" showLabel={false} />
              <div>
                <p className="text-2xl font-bold text-ink-900">58%</p>
                <p className="text-xs text-ink-500">per major storm event</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Seepage & Standing Water"
              subtitle="Groundwater and drainage risk"
              icon={<Clock className="w-5 h-5" />}
            />
            <div className="flex items-center gap-3">
              <RiskMeter score={41} size="sm" showLabel={false} />
              <div>
                <p className="text-2xl font-bold text-ink-900">41%</p>
                <p className="text-xs text-ink-500">combined risk index</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
