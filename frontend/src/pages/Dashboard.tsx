import { useEffect, useState, type ReactNode } from 'react';
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
import { getHealthStatus, getPropertyRisk } from '../services/api';
import type { PropertyRiskApiResponse } from '../types/risk';

const mapLayers = [
  { id: 'radar', label: 'Weather Radar', color: '#3b82f6' },
  { id: 'flood', label: 'Flood Zones', color: '#06b6d4' },
  { id: 'storm', label: 'Storm Tracks', color: '#fbbf24' },
];

function mapRiskLevelToScore(level: string | undefined | null) {
  if (level === 'HIGH') return 78;
  if (level === 'MEDIUM') return 54;
  if (level === 'LOW') return 24;
  return 50;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeLayer, setActiveLayer] = useState('radar');
  const [backendStatus, setBackendStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [backendRisk, setBackendRisk] = useState<number | null>(null);
  const [riskDetails, setRiskDetails] = useState<PropertyRiskApiResponse | null>(null);
  const [riskError, setRiskError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const health = await getHealthStatus();
        if (!isMounted) return;
        setBackendStatus(health.status === 'UP' ? 'online' : 'offline');

        const risk = await getPropertyRisk(42.2808, -83.743);
        if (!isMounted) return;
        setRiskDetails(risk);
        setBackendRisk(mapRiskLevelToScore(risk.overallRiskLevel));
        setRiskError(null);
      } catch (error) {
        if (!isMounted) return;
        setBackendStatus('offline');
        setRiskError(error instanceof Error ? error.message : 'Unable to load live risk data.');
        setBackendRisk(null);
        setRiskDetails(null);
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const floodScore = riskDetails ? mapRiskLevelToScore(riskDetails.flood.floodRiskLevel) : null;
  const windSpeedMph = riskDetails?.weather.windSpeedKph == null ? null : Math.round(riskDetails.weather.windSpeedKph / 1.60934);
  const liveAlertCards = riskDetails ? [{
    id: 'live-risk-alert',
    type: riskDetails.weather.condition ?? 'Live observation',
    severity: 'moderate' as const,
    area: riskDetails.weather.location ?? 'Current location',
    expires: 'Updated live',
    description: riskDetails.weather.message ?? 'Current conditions captured from the backend.',
  }] : [];

  const markers = riskDetails ? [{
    id: 'live-property',
    lat: riskDetails.latitude,
    lng: riskDetails.longitude,
    label: riskDetails.weather.location ?? 'Live property',
    value: backendRisk ?? 0,
  }] : [];

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard' }]}> 
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Executive Dashboard</h1>
            <p className="text-sm text-ink-500 mt-1">Real-time property risk intelligence overview</p>
            {riskError && <p className="mt-1 text-xs text-risk-high">{riskError}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="high">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-high animate-pulse" />
              {liveAlertCards.length > 0 ? '1 Live Alert' : 'No Live Alert'}
            </Badge>
            <Badge variant={backendStatus === 'online' ? 'brand' : 'neutral'}>
              <Activity className={`w-3 h-3 ${backendStatus === 'loading' ? 'animate-pulse' : ''}`} />
              {backendStatus === 'online' ? 'Backend Connected' : backendStatus === 'loading' ? 'Connecting...' : 'Offline'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <RiskScoreCard icon={<ShieldCheck className="w-5 h-5" />} label="Overall Risk" value={backendRisk} color="text-risk-high" />
          <RiskScoreCard icon={<Waves className="w-5 h-5" />} label="Flood" value={floodScore} color="text-brand-500" />
          <RiskScoreCard icon={<CloudHail className="w-5 h-5" />} label="Hail" value={null} fallback="N/A" color="text-risk-medium" />
          <RiskScoreCard icon={<Wind className="w-5 h-5" />} label="Wind" value={windSpeedMph} fallback="—" color="text-risk-medium" />
          <RiskScoreCard icon={<CloudLightning className="w-5 h-5" />} label="Hurricane" value={null} fallback="N/A" color="text-risk-low" />
          <RiskScoreCard icon={<Flame className="w-5 h-5" />} label="Wildfire" value={null} fallback="N/A" color="text-risk-low" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-ink-200/60">
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">Interactive Risk Map</h3>
                  <p className="text-xs text-ink-500">Live backend location and risk signal</p>
                </div>
              </div>
              <InteractiveMap
                markers={markers}
                layers={mapLayers}
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
                onMarkerClick={(m) => navigate(`/app/property/${encodeURIComponent(m.label)}`)}
                height="h-[400px]"
              />
            </Card>
          </div>

          <Card>
            <CardHeader title="Live Weather Snapshot" subtitle="Current backend signal" icon={<AlertTriangle className="w-5 h-5" />} />
            <div className="space-y-3">
              {liveAlertCards.length === 0 ? (
                <div className="rounded-lg border border-dashed border-ink-200 p-4 text-sm text-ink-500">
                  Live weather details are currently unavailable.
                </div>
              ) : liveAlertCards.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg border border-ink-200 hover:border-ink-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-ink-900">{alert.type}</span>
                    <Badge variant="medium">{alert.severity}</Badge>
                  </div>
                  <p className="text-xs text-ink-500 mb-1">{alert.area}</p>
                  <p className="text-xs text-ink-400">{alert.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <CardHeader title="Recent Storms" subtitle="Last 30 days" icon={<TrendingUp className="w-5 h-5" />} />
            <div className="space-y-2.5">
              <div className="rounded-lg border border-dashed border-ink-200 p-3 text-sm text-ink-500">
                Storm history remains available from the existing experience views.
              </div>
            </div>
            <button onClick={() => navigate('/app/storms')} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 mt-3">
              View all storms <ArrowRight className="w-3 h-3" />
            </button>
          </Card>

          <Card hover>
            <CardHeader title="AI Recommendations" subtitle="Top predictions" icon={<Brain className="w-5 h-5" />} />
            <div className="rounded-lg border border-dashed border-ink-200 p-3 text-sm text-ink-500">
              Live AI recommendations are still being prepared for the backend-driven experience.
            </div>
            <button onClick={() => navigate('/app/ai')} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 mt-3">
              View all predictions <ArrowRight className="w-3 h-3" />
            </button>
          </Card>

          <Card hover>
            <CardHeader title="Contractor Demand" subtitle="High-demand areas" icon={<HardHat className="w-5 h-5" />} />
            <div className="rounded-lg border border-dashed border-ink-200 p-3 text-sm text-ink-500">
              Contractor demand insights are still routed through the broader intelligence experience.
            </div>
            <button onClick={() => navigate('/app/contractor')} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 mt-3">
              View details <ArrowRight className="w-3 h-3" />
            </button>
          </Card>

          <Card hover>
            <CardHeader title="Insurance Risk" subtitle="Portfolio summary" icon={<ShieldCheck className="w-5 h-5" />} />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">Avg Risk Score</p>
                <p className="text-xl font-bold text-ink-900">{backendRisk ?? '—'}</p>
              </div>
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">Live Signal</p>
                <p className="text-xl font-bold text-risk-high">{riskDetails?.weather.success ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">Air Quality</p>
                <p className="text-xl font-bold text-ink-900">{riskDetails?.airQuality.aqi ?? '—'}</p>
              </div>
              <div className="p-3 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500">Flood</p>
                <p className="text-xl font-bold text-ink-900">{riskDetails?.flood.floodRiskLevel ?? '—'}</p>
              </div>
            </div>
            <button onClick={() => navigate('/app/reports')} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              Generate report <ArrowRight className="w-3 h-3" />
            </button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function RiskScoreCard({ icon, label, value, fallback, color }: { icon: ReactNode; label: string; value: number | null | undefined; fallback?: string; color: string }) {
  const displayValue = value == null ? (fallback ?? '—') : value;
  return (
    <div className="card p-4 card-hover">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-ink-50 mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-ink-900">{displayValue}</span>
        {typeof displayValue === 'number' && <span className="text-xs text-ink-400">/100</span>}
      </div>
    </div>
  );
}
