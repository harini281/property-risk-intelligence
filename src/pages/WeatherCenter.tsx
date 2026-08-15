import { useState } from 'react';
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
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { StatCard, Badge } from '../components/RiskMeter';
import { InteractiveMap } from '../components/InteractiveMap';
import { currentWeather, weatherAlerts } from '../data/mockData';

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

  // Radar markers centered on the current weather location (Ann Arbor, MI).
  const radarMarkers = [
    {
      id: 'station-annarbor',
      lat: 42.2808,
      lng: -83.7430,
      label: `${currentWeather.location} • ${currentWeather.temperature}°`,
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
              value={`${currentWeather.temperature}°F`}
              icon={<Thermometer className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Wind Speed"
              value={`${currentWeather.windSpeed} mph`}
              icon={<Wind className="w-5 h-5" />}
              color="text-brand-600"
              trend={`${currentWeather.windDirection} direction`}
              trendUp
            />
            <StatCard
              label="Humidity"
              value={`${currentWeather.humidity}%`}
              icon={<Droplets className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Pressure"
              value={`${currentWeather.pressure} inHg`}
              icon={<Gauge className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Visibility"
              value={`${currentWeather.visibility} mi`}
              icon={<Eye className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="UV Index"
              value={currentWeather.uvIndex}
              icon={<Sun className="w-5 h-5" />}
              color="text-brand-600"
            />
            <StatCard
              label="Feels Like"
              value={`${currentWeather.feelsLike}°F`}
              icon={<Thermometer className="w-5 h-5" />}
              color="text-brand-600"
            />
          </div>
        </div>

        {/* 5-day forecast strip */}
        <Card>
          <CardHeader
            title="5-Day Forecast"
            subtitle={`${currentWeather.location} — extended outlook`}
            icon={<CloudSun className="w-5 h-5" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {currentWeather.forecast.map((day, idx) => {
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
            subtitle={`${weatherAlerts.length} active warnings — sorted by severity`}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <div className="space-y-3">
            {weatherAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-colors ${severityAccent(
                  alert.severity,
                )}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.severity === 'extreme' || alert.severity === 'severe'
                          ? 'text-risk-high'
                          : alert.severity === 'moderate'
                            ? 'text-risk-medium'
                            : 'text-ink-500'
                      }`}
                    />
                    <span className="text-sm font-semibold text-ink-900">{alert.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={severityVariant(alert.severity)}>{alert.severity}</Badge>
                    <span className="text-xs text-ink-500">{alert.expires}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-600 mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {alert.area}
                </div>
                <p className="text-xs text-ink-500 leading-relaxed">{alert.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
