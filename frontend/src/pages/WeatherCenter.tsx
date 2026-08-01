import { useEffect, useState } from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Cloud,
  Sun as SunIcon,
  AlertTriangle,
  MapPin,
  Navigation,
  RefreshCw,
  Activity,
  Loader2,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { StatCard, Badge } from '../components/RiskMeter';
import { InteractiveMap } from '../components/InteractiveMap';
import { getWeather } from '../services/api';
import type { PropertyRiskApiResponse } from '../types/risk';

const mapLayers = [
  { id: 'radar', label: 'Weather Radar', color: '#3b82f6' },
  { id: 'flood', label: 'Flood Zones', color: '#06b6d4' },
  { id: 'storm', label: 'Storm Tracks', color: '#fbbf24' },
];

// Map a forecast condition string to a lucide icon + accent color.
const conditionIcon: Record<string, { icon: typeof CloudSun; color: string }> = {
  'Partly Cloudy': { icon: CloudSun, color: 'text-brand-500' },
  Sunny: { icon: SunIcon, color: 'text-amber-500' },
  Rain: { icon: CloudRain, color: 'text-brand-600' },
  Thunderstorms: { icon: CloudLightning, color: 'text-risk-medium' },
  Cloudy: { icon: Cloud, color: 'text-ink-400' },
};

function severityVariant(severity: string): 'critical' | 'high' | 'medium' | 'neutral' {
  if (severity === 'extreme') return 'critical';
  if (severity === 'severe') return 'high';
  if (severity === 'moderate') return 'medium';
  return 'neutral';
}

function severityAccent(severity: string): string {
  if (severity === 'extreme') return 'border-red-300 bg-red-50';
  if (severity === 'severe') return 'border-red-200 bg-red-50/60';
  if (severity === 'moderate') return 'border-amber-200 bg-amber-50/60';
  return 'border-ink-200 bg-ink-50';
}

export default function WeatherCenter() {
  const [activeLayer, setActiveLayer] = useState('radar');
  const [currentWeather, setCurrentWeather] = useState<PropertyRiskApiResponse['weather'] | null>(null);
  const [weatherMessage, setWeatherMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getWeather(42.2808, -83.743).then((weather) => {
      if (!active) return;
      if (!weather.success) {
        setCurrentWeather(null);
        setWeatherMessage(weather.message ?? 'Live weather is temporarily unavailable.');
        setError(weather.message ?? 'Live weather is temporarily unavailable.');
        return;
      }
      setCurrentWeather(weather);
      setWeatherMessage(weather.message);
      setError(null);
    }).catch(() => {
      if (active) {
        setCurrentWeather(null);
        setWeatherMessage('Live weather is temporarily unavailable.');
        setError('Live weather is temporarily unavailable.');
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const weatherSummary = currentWeather ? {
    location: currentWeather.location ?? 'Unknown location',
    temperature: currentWeather.temperatureCelsius === null ? null : Math.round((currentWeather.temperatureCelsius * 9 / 5) + 32),
    condition: currentWeather.condition ?? 'Unavailable',
    humidity: currentWeather.humidityPercent == null ? null : Math.round(currentWeather.humidityPercent),
    windSpeed: currentWeather.windSpeedKph == null ? null : Math.round(currentWeather.windSpeedKph / 1.60934),
    windDirection: 'Live',
    feelsLike: currentWeather.temperatureCelsius === null ? null : Math.round((currentWeather.temperatureCelsius * 9 / 5) + 32),
    pressure: null,
    visibility: null,
    uvIndex: '—',
    forecast: [],
  } : {
    location: 'Unavailable',
    temperature: null,
    condition: 'Unavailable',
    humidity: null,
    windSpeed: null,
    windDirection: 'Live',
    feelsLike: null,
    pressure: null,
    visibility: null,
    uvIndex: '—',
    forecast: [],
  };

  const radarMarkers = [
    {
      id: 'station-annarbor',
      lat: 42.2808,
      lng: -83.7430,
      label: `${weatherSummary.location} • ${weatherSummary.temperature ?? '—'}°`,
      color: '#2563eb',
    },
    {
      id: 'cell-kent',
      lat: 42.9634,
      lng: -85.6681,
      label: 'Storm Cell — Kent County',
      color: '#ef4444',
    },
    {
      id: 'cell-traverse',
      lat: 44.7631,
      lng: -85.6206,
      label: 'Heavy Rain — Traverse City',
      color: '#f59e0b',
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Live Weather' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Live Weather Center</h1>
            <p className="text-sm text-ink-500 mt-1">
              Real-time atmospheric conditions and severe weather monitoring
            </p>
            {weatherMessage && <p className="mt-1 text-xs text-ink-500">{weatherMessage}</p>}
            {error && <p className="mt-1 text-xs text-risk-high">{error}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="brand">
              <Activity className="w-3 h-3" /> Live
            </Badge>
            <Badge variant="high">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-high animate-pulse" />
              {weatherAlerts.length} Active Alerts
            </Badge>
          </div>
        </div>

        {/* Location + current condition banner */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <CloudSun className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm text-ink-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentWeather.location}
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-bold text-ink-900">
                    {currentWeather.temperature}°
                  </span>
                  <span className="text-sm font-medium text-ink-500">F</span>
                </div>
                <p className="text-sm text-ink-600 mt-0.5">{currentWeather.condition}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-sm text-ink-500">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-500" />
                <span>
                  Wind {currentWeather.windDirection} {currentWeather.windSpeed} mph
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-brand-500" />
                <span>Feels like {currentWeather.feelsLike}°F</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
                <RefreshCw className="w-3.5 h-3.5" />
                Updated 2m ago
              </button>
            </div>
          </div>
        </Card>

        {/* Current weather stats grid */}
        <div>
          <h2 className="text-sm font-semibold text-ink-900 mb-3">Current Conditions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            <StatCard
              label="Temperature"
              value={weatherSummary.temperature == null ? '—' : `${weatherSummary.temperature}°F`}
              icon={<Thermometer className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Wind Speed"
              value={weatherSummary.windSpeed == null ? '—' : `${weatherSummary.windSpeed} mph`}
              icon={<Wind className="w-5 h-5" />}
              color="text-brand-600"
              trend={weatherSummary.windDirection === 'Live' ? 'Live direction' : `${weatherSummary.windDirection} direction`}
              trendUp
            />
            <StatCard
              label="Humidity"
              value={weatherSummary.humidity == null ? '—' : `${weatherSummary.humidity}%`}
              icon={<Droplets className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Pressure"
              value={weatherSummary.pressure == null ? '—' : `${weatherSummary.pressure} inHg`}
              icon={<Gauge className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Visibility"
              value={weatherSummary.visibility == null ? '—' : `${weatherSummary.visibility} mi`}
              icon={<Eye className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="UV Index"
              value={weatherSummary.uvIndex}
              icon={<Sun className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Feels Like"
              value={weatherSummary.feelsLike == null ? '—' : `${weatherSummary.feelsLike}°F`}
              icon={<Thermometer className="w-5 h-5" />}
              color="text-brand-600"
            />
          </div>
        </div>

        {/* 5-day forecast strip */}
        <Card>
          <CardHeader
            title="5-Day Forecast"
            subtitle={`${weatherSummary.location} — extended outlook`}
            icon={<CloudSun className="w-5 h-5" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {weatherSummary.forecast.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-ink-200 p-4 text-sm text-ink-500">
                Forecast details are not available from the current backend response.
              </div>
            ) : weatherSummary.forecast.map((day, idx) => {
              const cfg = conditionIcon[day.condition] ?? conditionIcon['Partly Cloudy'];
              const Icon = cfg.icon;
              const isToday = idx === 0;
              return (
                <div
                  key={day.day}
                  className={`p-4 rounded-xl border transition-colors ${
                    isToday
                      ? 'border-brand-200 bg-brand-50/60'
                      : 'border-ink-200 bg-ink-50/40 hover:border-ink-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-ink-700 uppercase tracking-wide">
                    {day.day}
                  </p>
                  <div className={`my-2 ${cfg.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-ink-500 mb-2">{day.condition}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-ink-900">{day.high}°</span>
                    <span className="text-sm text-ink-400">{day.low}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Radar map */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-ink-200/60">
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Weather Radar</h3>
              <p className="text-xs text-ink-500">
                Live precipitation and storm cell tracking — Michigan region
              </p>
            </div>
            <Badge variant="brand">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Radar Active
            </Badge>
          </div>
          <InteractiveMap
            markers={radarMarkers}
            layers={mapLayers}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            height="h-[460px]"
          />
        </Card>

        {/* Active weather alerts */}
        <Card>
          <CardHeader
            title="Active Weather Alerts"
            subtitle="Backend-driven weather status"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <div className="space-y-3">
            {error ? (
              <div className="rounded-lg border border-dashed border-ink-200 p-4 text-sm text-ink-500">
                {error}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-ink-200 p-4 text-sm text-ink-500">
                The live backend response did not include alert payloads, so no alert cards are displayed.
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
