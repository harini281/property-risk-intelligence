import { FormEvent, useState } from 'react';
import { MapPin, Search, Wind } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { Badge, RiskMeter } from '../components/RiskMeter';
import { InteractiveMap } from '../components/InteractiveMap';
import { geocodeAddress, getPropertyRisk } from '../services/api';
import type { GeocodingApiResponse, PropertyRiskApiResponse } from '../types/risk';

function riskScore(level: string | undefined) {
  return level === 'HIGH' ? 75 : level === 'MEDIUM' ? 50 : level === 'LOW' ? 25 : 0;
}

export default function PropertySearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<GeocodingApiResponse | null>(null);
  const [risk, setRisk] = useState<PropertyRiskApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setError(null); setLocation(null); setRisk(null);
    try {
      const resolved = await geocodeAddress(query.trim());
      setLocation(resolved);
      if (!resolved.success || resolved.latitude === null || resolved.longitude === null) return;
      setRisk(await getPropertyRisk(resolved.latitude, resolved.longitude));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The property search could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const score = riskScore(risk?.overallRiskLevel);
  const hasCoordinates = location?.success && location.latitude !== null && location.longitude !== null;

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Property Search' }]}>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-ink-900">Property Search</h1><p className="mt-1 text-sm text-ink-500">Search an address to locate it and retrieve live risk intelligence.</p></div>
        <Card>
          <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter an address, city, or ZIP code..." className="input py-3 pl-11 text-base" autoFocus /></div>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Searching…' : 'Search property'}</button>
          </form>
          {error && <p role="alert" className="mt-3 text-sm text-risk-high">{error}</p>}
          {location && !location.success && <p role="status" className="mt-3 text-sm text-ink-500">{location.message}</p>}
        </Card>

        {hasCoordinates && (
          <>
            <Card className="p-0 overflow-hidden"><div className="border-b border-ink-200/60 p-4"><h3 className="text-sm font-semibold text-ink-900">{location.displayName}</h3><p className="text-xs text-ink-500">{location.latitude?.toFixed(5)}, {location.longitude?.toFixed(5)}</p></div><InteractiveMap center={{ lat: location.latitude!, lng: location.longitude! }} markers={[{ id: 'searched-property', lat: location.latitude!, lng: location.longitude!, label: location.displayName ?? 'Searched property' }]} showLayers={false} height="h-80" /></Card>

            {risk && <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="flex flex-col items-center justify-center"><p className="text-sm font-semibold text-ink-900">Current overall risk</p><RiskMeter score={score} size="lg" showLabel={false} /><Badge className="mt-3" variant={risk.overallRiskLevel === 'HIGH' ? 'high' : risk.overallRiskLevel === 'MEDIUM' ? 'medium' : 'low'}>{risk.overallRiskLevel ?? 'UNKNOWN'}</Badge></Card>
              <Card className="lg:col-span-2"><div className="flex items-start gap-3"><Wind className="mt-1 h-5 w-5 text-brand-600" /><div><h3 className="font-semibold text-ink-900">Live NOAA weather</h3>{risk.weather.success ? <><p className="mt-1 text-2xl font-bold text-ink-900">{risk.weather.temperatureCelsius?.toFixed(1)}°C</p><p className="text-sm text-ink-600">{risk.weather.condition} · humidity {risk.weather.humidityPercent?.toFixed(0) ?? 'N/A'}% · wind {risk.weather.windSpeedKph?.toFixed(1) ?? 'N/A'} km/h</p></> : <p className="mt-2 text-sm text-ink-500">{risk.weather.message}</p>}</div></div><div className="mt-5 border-t border-ink-100 pt-4 text-sm text-ink-600"><p><strong>Flood:</strong> {risk.flood.success ? (risk.flood.floodRiskLevel ?? 'Unknown') : 'Pending provider integration'}</p><p className="mt-2"><strong>Air quality:</strong> {risk.airQuality.success ? `${risk.airQuality.aqi ?? 'Unknown'} AQI` : 'Pending provider integration'}</p></div></Card>
            </div>}
          </>
        )}

        {!location && !loading && <Card className="py-10 text-center text-sm text-ink-500"><MapPin className="mx-auto mb-2 h-6 w-6 text-ink-400" />Enter an address to place it on the map and load available live data.</Card>}
      </div>
    </AppLayout>
  );
}
