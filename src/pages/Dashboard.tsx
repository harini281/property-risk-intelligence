import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CloudHail, Wind, Waves, Flame, CloudLightning,
  TrendingUp, Brain, HardHat, ShieldCheck, ArrowRight, Activity,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { Badge, ProgressBar } from '../components/RiskMeter';
import { InteractiveMap } from '../components/InteractiveMap';
import { Sparkline } from '../components/Charts';
import { properties, stormEvents, weatherAlerts, aiPredictions, contractorDemand } from '../data/mockData';

const mapLayers = [
  { id: 'radar', label: 'Weather Radar', color: '#3b82f6' },
  { id: 'flood', label: 'Flood Zones', color: '#06b6d4' },
  { id: 'storm', label: 'Storm Tracks', color: '#fbbf24' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeLayer, setActiveLayer] = useState('radar');

  const markers = properties.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.address,
    value: p.overallRisk,
  }));

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Executive Dashboard</h1>
            <p className="text-sm text-ink-500 mt-1">Real-time property risk intelligence overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="high">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-high animate-pulse" />
              4 Active Alerts
            </Badge>
            <Badge variant="brand">
              <Activity className="w-3 h-3" /> Live
            </Badge>
          </div>
        </div>

        {/* Risk Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <RiskScoreCard icon={<ShieldCheck className="w-5 h-5" />} label="Overall Risk" value={76} color="text-risk-high" />
          <RiskScoreCard icon={<Waves className="w-5 h-5" />} label="Flood" value={48} color="text-brand-500" />
          <RiskScoreCard icon={<CloudHail className="w-5 h-5" />} label="Hail" value={72} color="text-risk-medium" />
          <RiskScoreCard icon={<Wind className="w-5 h-5" />} label="Wind" value={61} color="text-risk-medium" />
          <RiskScoreCard icon={<CloudLightning className="w-5 h-5" />} label="Hurricane" value={3} color="text-risk-low" />
          <RiskScoreCard icon={<Flame className="w-5 h-5" />} label="Wildfire" value={13} color="text-risk-low" />
        </div>

        {/* Map + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-ink-200/60">
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">Interactive Risk Map</h3>
                  <p className="text-xs text-ink-500">Michigan — weather and risk layers</p>
                </div>
              </div>
              <InteractiveMap
                markers={markers}
                layers={mapLayers}
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
                onMarkerClick={(m) => navigate(`/app/property/${m.id}`)}
                height="h-[400px]"
              />
            </Card>
          </div>

          <Card>
            <CardHeader title="Active Weather Alerts" subtitle="4 active warnings" icon={<AlertTriangle className="w-5 h-5" />} />
            <div className="space-y-3">
              {weatherAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border border-ink-200 hover:border-ink-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-ink-900">{alert.type}</span>
                    <Badge
                      variant={
                        alert.severity === 'extreme' ? 'critical' :
                        alert.severity === 'severe' ? 'high' :
                        alert.severity === 'moderate' ? 'medium' : 'neutral'
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-500 mb-1">{alert.area}</p>
                  <p className="text-xs text-ink-400">{alert.expires}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Recent Storms */}
          <Card hover>
            <CardHeader title="Recent Storms" subtitle="Last 30 days" icon={<TrendingUp className="w-5 h-5" />} />
            <div className="space-y-2.5">
              {stormEvents.slice(0, 4).map((storm) => (
                <div key={storm.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{storm.type}</p>
                    <p className="text-xs text-ink-500">{storm.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-ink-700">{storm.date}</p>
                    <p className="text-xs text-ink-400">{storm.damageEstimate}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/app/storms')}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 mt-3"
            >
              View all storms <ArrowRight className="w-3 h-3" />
            </button>
          </Card>

          {/* AI Recommendations */}
          <Card hover>
            <CardHeader title="AI Recommendations" subtitle="Top predictions" icon={<Brain className="w-5 h-5" />} />
            <div className="space-y-3">
              {aiPredictions.slice(0, 4).map((pred) => (
                <div key={pred.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-ink-700">{pred.label}</span>
                    <span className="text-xs font-bold text-ink-900">{pred.probability}%</span>
                  </div>
                  <ProgressBar value={pred.probability} />
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/app/ai')}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 mt-3"
            >
              View all predictions <ArrowRight className="w-3 h-3" />
            </button>
          </Card>

          {/* Contractor Demand */}
          <Card hover>
            <CardHeader title="Contractor Demand" subtitle="High-demand areas" icon={<HardHat className="w-5 h-5" />} />
            <div className="space-y-2.5">
              {contractorDemand.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{c.area}</p>
                    <p className="text-xs text-ink-500">{c.estimatedRepairCost}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkline data={[20, 35, 45, 60, 75, c.demandIndex]} color="#f59e0b" height={24} className="w-16" />
                    <span className="text-xs font-bold text-ink-900">{c.demandIndex}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/app/contractor')}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 mt-3"
            >
              View details <ArrowRight className="w-3 h-3" />
            </button>
          </Card>

          {/* Insurance Risk */}
          <Card hover>
            <CardHeader title="Insurance Risk" subtitle="Portfolio summary" icon={<ShieldCheck className="w-5 h-5" />} />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">Avg Risk Score</p>
                <p className="text-xl font-bold text-ink-900">70</p>
              </div>
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">High Risk</p>
                <p className="text-xl font-bold text-risk-high">3</p>
              </div>
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">Claims (12mo)</p>
                <p className="text-xl font-bold text-ink-900">8</p>
              </div>
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">Exposure</p>
                <p className="text-xl font-bold text-ink-900">$1.2M</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/reports')}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Generate report <ArrowRight className="w-3 h-3" />
            </button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function RiskScoreCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="card p-4 card-hover">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-ink-50 mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-ink-900">{value}</span>
        <span className="text-xs text-ink-400">/100</span>
      </div>
    </div>
  );
}
