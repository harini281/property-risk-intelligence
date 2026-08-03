import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Download, Share2, FileText,
  Waves, CloudHail, Wind, CloudLightning, Flame, CheckCircle2, Brain, AlertTriangle, Loader2,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { RiskMeter, ProgressBar, Badge } from '../components/RiskMeter';
import { InteractiveMap } from '../components/InteractiveMap';
import { BarChart } from '../components/Charts';
import { supabase } from '../lib/supabase';
import { geocodeAddress, getPropertyRisk } from '../services/api';
import type { GeocodingApiResponse, PropertyRiskApiResponse } from '../types/risk';

function mapRiskLevelToScore(level: string | undefined) {
  if (level === 'HIGH') return 75;
  if (level === 'MEDIUM') return 50;
  if (level === 'LOW') return 25;
  return 0;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decodedId = id ? decodeURIComponent(id) : undefined;
  const [saved, setSaved] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<GeocodingApiResponse | null>(null);
  const [liveRisk, setLiveRisk] = useState<PropertyRiskApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSaved, setCheckingSaved] = useState(false);

  useEffect(() => {
    if (!decodedId) return;

    let active = true;
    const loadLive = async () => {
      setLoading(true);
      setError(null);
      try {
        const resolved = await geocodeAddress(decodedId);
        if (!active) return;
        setResolvedAddress(resolved);
        if (!resolved.success || resolved.latitude === null || resolved.longitude === null) {
          setError(resolved.message ?? 'The selected address could not be resolved.');
          return;
        }
        const risk = await getPropertyRisk(resolved.latitude, resolved.longitude);
        if (!active) return;
        setLiveRisk(risk);
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : 'Unable to load live property risk details.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadLive();
    return () => {
      active = false;
    };
  }, [decodedId]);

  useEffect(() => {
    if (!decodedId) return;
    let active = true;
    const checkSaved = async () => {
      setCheckingSaved(true);
      const { data } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('address', decodedId)
        .maybeSingle();
      if (!active) return;
      setSaved(!!data);
      setCheckingSaved(false);
    };
    void checkSaved();
    return () => {
      active = false;
    };
  }, [decodedId]);

  if (!decodedId) {
    return (
      <AppLayout>
        <Card className="text-center py-12">
          <p className="text-ink-500">Property not found.</p>
          <button onClick={() => navigate('/app/search')} className="btn-primary mt-4">Back to Search</button>
        </Card>
      </AppLayout>
    );
  }

  const displayAddress = resolvedAddress?.displayName ?? decodedId;
  const displayLocation = resolvedAddress?.displayName ?? 'Live location';
  const displayLat = resolvedAddress?.latitude ?? 42.2808;
  const displayLng = resolvedAddress?.longitude ?? -83.743;
  const displayRisk = mapRiskLevelToScore(liveRisk?.overallRiskLevel);
  const displayRiskLabel = liveRisk?.overallRiskLevel ?? 'UNKNOWN';

  const riskBars = [
    { label: 'Flood Risk', value: liveRisk ? (liveRisk.flood.floodRiskLevel === 'HIGH' ? 80 : liveRisk.flood.floodRiskLevel === 'MEDIUM' ? 55 : liveRisk.flood.floodRiskLevel === 'LOW' ? 20 : 0) : 0, icon: <Waves className="w-4 h-4" /> },
    { label: 'Air Quality', value: liveRisk?.airQuality.aqi ? Math.min(100, Math.round((liveRisk.airQuality.aqi / 500) * 100)) : 0, icon: <CloudHail className="w-4 h-4" /> },
    { label: 'Wind Risk', value: liveRisk?.weather.windSpeedKph ? Math.min(100, Math.round((liveRisk.weather.windSpeedKph / 120) * 100)) : 0, icon: <Wind className="w-4 h-4" /> },
    { label: 'Weather Status', value: liveRisk?.weather.success ? 40 : 0, icon: <CloudLightning className="w-4 h-4" /> },
    { label: 'Coverage', value: liveRisk ? 70 : 0, icon: <Flame className="w-4 h-4" /> },
  ];

  const riskBarData = riskBars.map((r) => ({ label: r.label.replace(' Risk', '').replace(' Status', ''), value: r.value }));

  const handleSave = async () => {
    if (!decodedId) return;
    if (saved) {
      await supabase.from('saved_properties').delete().eq('address', decodedId);
      setSaved(false);
    } else {
      await supabase.from('saved_properties').insert({
        address: decodedId,
        risk_score: displayRisk,
      });
      setSaved(true);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Property Search', to: '/app/search' }, { label: displayAddress }]}>
      <div className="space-y-6">
        {/* Hero image */}
        <div className="relative h-64 rounded-xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80" alt={displayAddress} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-2xl font-bold">{displayAddress}</h1>
            <p className="flex items-center gap-1.5 text-sm text-white/80 mt-1">
              <MapPin className="w-4 h-4" /> {displayLocation}
            </p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleSave} disabled={checkingSaved} className={saved ? 'btn-primary' : 'btn-secondary'}>
              {saved ? 'Saved' : 'Save Property'}
            </button>
            <button className="btn-secondary">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Top section: risk score + property info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">Overall Risk Score</h3>
            {loading ? (
              <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
            ) : (
              <RiskMeter score={displayRisk} size="lg" showLabel={false} />
            )}
            <Badge
              variant={displayRisk >= 80 ? 'critical' : displayRisk >= 60 ? 'high' : displayRisk >= 30 ? 'brand' : 'low'}
              className="mt-4"
            >
              {displayRiskLabel} Risk
            </Badge>
            {loading && <p className="mt-3 text-xs text-ink-500">Loading live risk details…</p>}
            {error && <p className="mt-3 text-xs text-risk-high">{error}</p>}
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="Property Information" icon={<FileText className="w-5 h-5" />} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="Resolved Address" value={resolvedAddress?.displayName ?? (loading ? 'Pending resolution' : 'Unavailable')} />
              <InfoItem label="Coordinates" value={`${displayLat.toFixed(4)}, ${displayLng.toFixed(4)}`} />
              <InfoItem label="Weather" value={liveRisk?.weather.success ? liveRisk.weather.condition ?? 'Available' : (loading ? 'Pending' : 'Unavailable')} />
              <InfoItem label="Air Quality" value={liveRisk?.airQuality.success ? `${liveRisk.airQuality.aqi ?? 'N/A'} AQI` : (loading ? 'Pending' : 'Unavailable')} />
              <InfoItem label="Flood Zone" value={liveRisk?.flood.success ? liveRisk.flood.floodZone ?? 'Unknown' : (loading ? 'Pending' : 'Unavailable')} />
              <InfoItem label="Risk Level" value={liveRisk?.overallRiskLevel ?? (loading ? 'Pending' : 'Unavailable')} />
              <InfoItem label="Generated At" value={liveRisk?.generatedAt ? new Date(liveRisk.generatedAt).toLocaleString() : (loading ? 'Pending' : 'Unavailable')} />
              <InfoItem label="Health Category" value={liveRisk?.airQuality.success ? liveRisk.airQuality.healthCategory ?? 'N/A' : (loading ? 'Pending' : 'Unavailable')} />
            </div>
          </Card>
        </div>

        {/* Risk breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Risk Breakdown" subtitle="Peril-specific analysis" icon={<AlertTriangle className="w-5 h-5" />} />
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-ink-400" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-dashed border-ink-200 p-4 text-sm text-ink-500">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {riskBars.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-2 text-sm font-medium text-ink-700">
                        {r.icon} {r.label}
                      </span>
                      <span className="text-sm font-semibold text-ink-900">{r.value}/100</span>
                    </div>
                    <ProgressBar value={r.value} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Risk Comparison" subtitle="Visual breakdown" />
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-ink-400" />
              </div>
            ) : (
              <BarChart data={riskBarData} height={220} />
            )}
          </Card>
        </div>

        {/* AI Summary + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="AI Summary" subtitle="Generated by RiskIntel AI" icon={<Brain className="w-5 h-5" />} />
            <div className="p-4 bg-brand-50/50 rounded-lg border border-brand-100">
              <p className="text-sm text-ink-700 leading-relaxed italic">
                {loading
                  ? 'Live risk insights are being loaded from the backend.'
                  : error
                    ? 'Live risk insights are currently unavailable.'
                    : liveRisk
                      ? `Live analysis indicates ${liveRisk.overallRiskLevel?.toLowerCase() ?? 'unknown'} risk with ${liveRisk.weather.condition ?? 'current weather'} conditions.`
                      : 'Live risk insights are being loaded from the backend.'}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-ink-400">
              <Brain className="w-3.5 h-3.5" /> Powered by 30+ data sources and historical analysis
            </div>
          </Card>

          <Card>
            <CardHeader title="Recommendations" subtitle="Actionable next steps" icon={<CheckCircle2 className="w-5 h-5" />} />
            <div className="space-y-2.5">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-ink-400" />
                </div>
              ) : error ? (
                <div className="p-3 bg-ink-50 rounded-lg text-sm text-ink-700">
                  Live recommendations will appear once the backend provides a detailed response.
                </div>
              ) : liveRisk ? (
                <div className="p-3 bg-ink-50 rounded-lg text-sm text-ink-700">
                  {`Flood status: ${liveRisk.flood.floodRiskLevel ?? 'Unknown'} · Air quality: ${liveRisk.airQuality.aqi ?? 'N/A'} AQI · Weather: ${liveRisk.weather.condition ?? 'N/A'}`}
                </div>
              ) : (
                <div className="p-3 bg-ink-50 rounded-lg text-sm text-ink-700">
                  Live recommendations will appear once the backend provides a detailed response.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-ink-200/60">
            <h3 className="text-sm font-semibold text-ink-900">Location Map</h3>
          </div>
          <InteractiveMap
            markers={[{ id: displayAddress, lat: displayLat, lng: displayLng, label: displayAddress, value: displayRisk }]}
            showLayers={false}
            height="h-72"
          />
        </Card>

        {/* Export buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/app/reports')} className="btn-primary">
            <Download className="w-4 h-4" /> Download Report
          </button>
          <button className="btn-secondary">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="btn-secondary">
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 bg-ink-50 rounded-lg">
      {icon && <div className="text-ink-400 mb-1.5">{icon}</div>}
      <p className="text-xs text-ink-500">{label}</p>
      <p className="text-sm font-semibold text-ink-900 mt-0.5">{value}</p>
    </div>
  );
}