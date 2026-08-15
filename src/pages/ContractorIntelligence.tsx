import {
  HardHat,
  DollarSign,
  MapPin,
  TrendingUp,
  Hammer,
  Droplets,
  TreePine,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { InteractiveMap, type MapMarker } from '../components/InteractiveMap';
import { ProgressBar, Badge, StatCard } from '../components/RiskMeter';
import { Sparkline, BarChart } from '../components/Charts';
import { contractorDemand } from '../data/mockData';

const breadcrumbs = [
  { label: 'Dashboard', to: '/app' },
  { label: 'Contractor Intelligence' },
];

// Color a marker by its demand index
function demandColor(demandIndex: number): string {
  if (demandIndex >= 85) return '#ef4444'; // red
  if (demandIndex >= 75) return '#f59e0b'; // amber
  if (demandIndex >= 60) return '#3b82f6'; // blue
  return '#22c55e'; // green
}

function demandVariant(demandIndex: number): 'critical' | 'high' | 'medium' | 'low' {
  if (demandIndex >= 85) return 'critical';
  if (demandIndex >= 75) return 'high';
  if (demandIndex >= 60) return 'medium';
  return 'low';
}

// Build a synthetic sparkline series from a single demand entry so each card
// has a visible trend without needing historical data in the mock dataset.
function buildSparkline(demandIndex: number): number[] {
  const base = Math.max(20, demandIndex - 25);
  const points: number[] = [];
  for (let i = 0; i < 8; i++) {
    const wobble = Math.sin(i * 1.3) * 6 + (i / 7) * (demandIndex - base);
    points.push(Math.round(Math.max(10, Math.min(100, base + wobble))));
  }
  points.push(demandIndex);
  return points;
}

export default function ContractorIntelligence() {
  // Summary metrics
  const totalRepairDemand = '$19.1M';
  const highDemandAreas = contractorDemand.filter((c) => c.demandIndex >= 75).length;
  const avgDemandIndex = Math.round(
    contractorDemand.reduce((sum, c) => sum + c.demandIndex, 0) / contractorDemand.length,
  );
  const topDamageType = 'Roofing';

  // Map markers
  const markers: MapMarker[] = contractorDemand.map((c) => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    label: `${c.area} · ${c.demandIndex}`,
    value: c.demandIndex,
    color: demandColor(c.demandIndex),
  }));

  // Bar chart comparison across areas (roof / flood / tree)
  const categoryChartData = contractorDemand.flatMap((c) => [
    { label: `${c.area.split(',')[0]}\nRoof`, value: c.roofDamage, color: '#2563eb' },
    { label: `${c.area.split(',')[0]}\nFlood`, value: c.floodDamage, color: '#0ea5e9' },
    { label: `${c.area.split(',')[0]}\nTree`, value: c.treeDamage, color: '#16a34a' },
  ]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 ring-1 ring-brand-100">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink-900">Contractor Intelligence</h1>
              <p className="text-sm text-ink-500 mt-1">
                Repair demand forecasting and damage assessment by region
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="px-3 py-1.5">
              <Wrench className="w-3.5 h-3.5 inline mr-1.5" />
              Live Forecasting
            </Badge>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Repair Demand"
            value={totalRepairDemand}
            icon={<DollarSign className="w-5 h-5" />}
            trend="12.4%"
            trendUp
            color="text-brand-600"
          />
          <StatCard
            label="High-Demand Areas"
            value={highDemandAreas}
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="2 new"
            trendUp
            color="text-amber-600"
          />
          <StatCard
            label="Avg Demand Index"
            value={avgDemandIndex}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="6.1%"
            trendUp
            color="text-blue-600"
          />
          <StatCard
            label="Top Damage Type"
            value={topDamageType}
            icon={<Hammer className="w-5 h-5" />}
            trend="3.2%"
            trendUp
            color="text-red-600"
          />
        </div>

        {/* Interactive map */}
        <Card>
          <CardHeader
            title="Contractor Demand Map"
            subtitle="Repair demand intensity by region — colored by demand index"
            icon={<MapPin className="w-5 h-5" />}
            action={
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                  <span className="text-ink-500">Critical (85+)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                  <span className="text-ink-500">High (75+)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                  <span className="text-ink-500">Moderate (60+)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  <span className="text-ink-500">Low (&lt;60)</span>
                </span>
              </div>
            }
          />
          <InteractiveMap markers={markers} height="h-[420px]" showLayers={false} />
        </Card>

        {/* High Demand Areas list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HardHat className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-ink-900">High Demand Areas</h2>
            </div>
            <span className="text-xs text-ink-500">
              {contractorDemand.length} regions tracked
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {contractorDemand.map((c) => {
              const spark = buildSparkline(c.demandIndex);
              const variant = demandVariant(c.demandIndex);
              return (
                <Card key={c.id} hover className="flex flex-col">
                  {/* Area header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-ink-50 flex items-center justify-center text-ink-600 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-ink-900 truncate">{c.area}</h3>
                        <p className="text-xs text-ink-500">Repair Demand Index</p>
                      </div>
                    </div>
                    <Badge variant={variant}>{c.demandIndex}</Badge>
                  </div>

                  {/* Sparkline + index */}
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-3xl font-bold text-ink-900 leading-none">{c.demandIndex}</p>
                      <p className="text-[11px] text-ink-400 mt-1">8-period trend</p>
                    </div>
                    <div className="w-32">
                      <Sparkline data={spark} color={demandColor(c.demandIndex)} height={40} />
                    </div>
                  </div>

                  {/* Damage breakdown */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink-700 uppercase tracking-wide">
                      <Hammer className="w-3.5 h-3.5 text-brand-600" />
                      Damage Breakdown
                    </div>
                    <ProgressBar
                      label="Roof Damage"
                      value={c.roofDamage}
                      showValue
                      color="bg-brand-500"
                    />
                    <ProgressBar
                      label="Flood Damage"
                      value={c.floodDamage}
                      showValue
                      color="bg-sky-500"
                    />
                    <ProgressBar
                      label="Tree Damage"
                      value={c.treeDamage}
                      showValue
                      color="bg-green-600"
                    />
                  </div>

                  {/* Estimated repair cost */}
                  <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-ink-500">Estimated Repair Cost</span>
                    </div>
                    <span className="text-lg font-bold text-ink-900">{c.estimatedRepairCost}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Repair Demand by Category */}
        <Card>
          <CardHeader
            title="Repair Demand by Category"
            subtitle="Roof, flood, and tree damage comparison across tracked regions"
            icon={<TrendingUp className="w-5 h-5" />}
            action={
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2563eb' }} />
                  <span className="text-ink-500">Roof</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0ea5e9' }} />
                  <span className="text-ink-500">Flood</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#16a34a' }} />
                  <span className="text-ink-500">Tree</span>
                </span>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <BarChart data={categoryChartData} height={260} max={100} />
            </div>
          </div>
          {/* Category summary row */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-50">
              <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-ink-500">Avg Roof Damage</p>
                <p className="text-lg font-bold text-ink-900">
                  {Math.round(
                    contractorDemand.reduce((s, c) => s + c.roofDamage, 0) / contractorDemand.length,
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-sky-50">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-ink-500">Avg Flood Damage</p>
                <p className="text-lg font-bold text-ink-900">
                  {Math.round(
                    contractorDemand.reduce((s, c) => s + c.floodDamage, 0) / contractorDemand.length,
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <TreePine className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-ink-500">Avg Tree Damage</p>
                <p className="text-lg font-bold text-ink-900">
                  {Math.round(
                    contractorDemand.reduce((s, c) => s + c.treeDamage, 0) / contractorDemand.length,
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
