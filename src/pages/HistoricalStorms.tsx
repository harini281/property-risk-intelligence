import { useState, useMemo } from 'react';
import {
  CloudHail, Wind, Waves, Flame, CloudLightning,
  Calendar, MapPin, Gauge, CircleDollarSign, Database, History,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { InteractiveMap } from '../components/InteractiveMap';
import { Badge } from '../components/RiskMeter';
import { stormEvents } from '../data/mockData';
import { cn } from '../utils/cn';

type StormType = 'All' | 'Hail' | 'Tornado' | 'Flood' | 'Wind' | 'Thunderstorm';

const stormColors: Record<string, string> = {
  Hail: '#fbbf24',
  Tornado: '#ef4444',
  Flood: '#3b82f6',
  Hurricane: '#8b5cf6',
  Thunderstorm: '#f59e0b',
  Wind: '#06b6d4',
  Wildfire: '#f97316',
};

const stormIcons: Record<string, React.ReactNode> = {
  Hail: <CloudHail className="w-4 h-4" />,
  Tornado: <Wind className="w-4 h-4" />,
  Flood: <Waves className="w-4 h-4" />,
  Hurricane: <CloudLightning className="w-4 h-4" />,
  Thunderstorm: <CloudLightning className="w-4 h-4" />,
  Wind: <Wind className="w-4 h-4" />,
  Wildfire: <Flame className="w-4 h-4" />,
};

const filterOptions: StormType[] = ['All', 'Hail', 'Tornado', 'Flood', 'Wind', 'Thunderstorm'];

const mapLayers = [
  { id: 'storm', label: 'Storm Tracks', color: '#fbbf24' },
  { id: 'radar', label: 'Weather Radar', color: '#3b82f6' },
  { id: 'flood', label: 'Flood Zones', color: '#06b6d4' },
];

export default function HistoricalStorms() {
  const [filter, setFilter] = useState<StormType>('All');
  const [activeLayer, setActiveLayer] = useState('storm');
  const [selectedStorm, setSelectedStorm] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return filter === 'All'
      ? stormEvents
      : stormEvents.filter((e) => e.type === filter);
  }, [filter]);

  // Group events by year (descending)
  const eventsByYear = useMemo(() => {
    const groups: Record<string, typeof stormEvents> = {};
    [...filteredEvents]
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((e) => {
        const year = new Date(e.date).getFullYear().toString();
        if (!groups[year]) groups[year] = [];
        groups[year].push(e);
      });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredEvents]);

  const markers = useMemo(
    () =>
      filteredEvents.map((e) => ({
        id: e.id,
        lat: e.lat,
        lng: e.lng,
        label: `${e.type} — ${e.location}`,
        color: stormColors[e.type],
      })),
    [filteredEvents],
  );

  const totalDamage = useMemo(() => {
    const sum = filteredEvents.reduce((acc, e) => {
      const num = parseInt(e.damageEstimate.replace(/[^0-9]/g, ''), 10);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    if (sum >= 1_000_000) return `$${(sum / 1_000_000).toFixed(1)}M`;
    if (sum >= 1_000) return `$${(sum / 1_000).toFixed(0)}K`;
    return `$${sum}`;
  }, [filteredEvents]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Historical Storms' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Historical Storm Intelligence</h1>
            <p className="text-sm text-ink-500 mt-1">NOAA-verified storm events since 2008</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="brand">
              <Database className="w-3 h-3" /> {filteredEvents.length} Events
            </Badge>
            <Badge variant="high">
              <CircleDollarSign className="w-3 h-3" /> {totalDamage} Damage
            </Badge>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((opt) => {
            const isActive = filter === opt;
            const color = opt === 'All' ? '#3b82f6' : stormColors[opt];
            return (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
                  isActive
                    ? 'text-white shadow-md'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300 hover:bg-ink-50',
                )}
                style={isActive ? { backgroundColor: color, borderColor: color } : undefined}
              >
                {opt !== 'All' && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isActive ? '#fff' : color }}
                  />
                )}
                {opt}
              </button>
            );
          })}
        </div>

        {/* Map + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-ink-100">
                <CardHeader
                  title="Storm Event Map"
                  subtitle="Geographic distribution of verified events"
                  icon={<MapPin className="w-5 h-5" />}
                />
              </div>
              <InteractiveMap
                markers={markers}
                layers={mapLayers}
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
                height="h-[480px]"
              />
              {/* Legend */}
              <div className="p-4 border-t border-ink-100">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {Object.entries(stormColors).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-ink-600 font-medium">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Storm Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader
                title="Storm Timeline"
                subtitle="Events grouped by year"
                icon={<History className="w-5 h-5" />}
              />
              <div className="space-y-6 max-h-[560px] overflow-y-auto pr-2">
                {eventsByYear.length === 0 && (
                  <div className="text-center py-10 text-ink-400 text-sm">
                    No storm events match the selected filter.
                  </div>
                )}
                {eventsByYear.map(([year, events]) => (
                  <div key={year} className="relative">
                    {/* Year header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 text-brand-700 font-bold text-sm border border-brand-200">
                        {year}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink-900">{events.length} {events.length === 1 ? 'event' : 'events'}</p>
                        <p className="text-xs text-ink-500">
                          {events.reduce((acc, e) => acc + (parseInt(e.damageEstimate.replace(/[^0-9]/g, ''), 10) || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} total damage
                        </p>
                      </div>
                    </div>
                    {/* Vertical line */}
                    <div className="absolute left-6 top-14 bottom-0 w-px bg-ink-100" />
                    {/* Events */}
                    <div className="space-y-3 pl-2">
                      {events.map((e) => {
                        const isSelected = selectedStorm === e.id;
                        return (
                          <div
                            key={e.id}
                            onClick={() => setSelectedStorm(isSelected ? null : e.id)}
                            className={cn(
                              'relative pl-10 pb-3 cursor-pointer group',
                            )}
                          >
                            {/* Node */}
                            <span
                              className="absolute left-[18px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125"
                              style={{ backgroundColor: stormColors[e.type] }}
                            />
                            <div
                              className={cn(
                                'p-3 rounded-lg border transition-all duration-200',
                                isSelected
                                  ? 'bg-brand-50 border-brand-300 shadow-sm'
                                  : 'bg-white border-ink-100 group-hover:border-ink-200 group-hover:bg-ink-50',
                              )}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="flex items-center justify-center w-6 h-6 rounded-md text-white"
                                    style={{ backgroundColor: stormColors[e.type] }}
                                  >
                                    {stormIcons[e.type]}
                                  </span>
                                  <span className="text-sm font-semibold text-ink-900">{e.type}</span>
                                </div>
                                <span className="text-xs text-ink-500">{formatDate(e.date)}</span>
                              </div>
                              <p className="text-xs text-ink-600 flex items-center gap-1 mb-1">
                                <MapPin className="w-3 h-3" /> {e.location}
                              </p>
                              {isSelected && (
                                <p className="text-xs text-ink-600 mt-2 pt-2 border-t border-brand-200 leading-relaxed">
                                  {e.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <span className="flex items-center gap-1 text-ink-500">
                                  <Gauge className="w-3 h-3" /> {e.windSpeed} mph
                                </span>
                                <span className="flex items-center gap-1 text-ink-500">
                                  <CloudHail className="w-3 h-3" /> {e.hailSize}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-risk-high">
                                  <CircleDollarSign className="w-3 h-3" /> {e.damageEstimate}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Storm Details Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-ink-100">
            <CardHeader
              title="Storm Details"
              subtitle="Complete record of verified storm events"
              icon={<Database className="w-5 h-5" />}
              action={
                <Badge variant="neutral">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'record' : 'records'}
                </Badge>
              }
            />
          </div>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                  <th className="text-left font-semibold px-5 py-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</span>
                  </th>
                  <th className="text-left font-semibold px-5 py-3">Storm Type</th>
                  <th className="text-right font-semibold px-5 py-3">
                    <span className="flex items-center justify-end gap-1.5"><Gauge className="w-3.5 h-3.5" /> Wind Speed</span>
                  </th>
                  <th className="text-right font-semibold px-5 py-3">
                    <span className="flex items-center justify-end gap-1.5"><CloudHail className="w-3.5 h-3.5" /> Hail Size</span>
                  </th>
                  <th className="text-right font-semibold px-5 py-3">
                    <span className="flex items-center justify-end gap-1.5"><CircleDollarSign className="w-3.5 h-3.5" /> Damage Estimate</span>
                  </th>
                  <th className="text-left font-semibold px-5 py-3">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-ink-400 text-sm">
                      No storm events match the selected filter.
                    </td>
                  </tr>
                )}
                {[...filteredEvents]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((e) => {
                    const isSelected = selectedStorm === e.id;
                    return (
                      <tr
                        key={e.id}
                        onClick={() => setSelectedStorm(isSelected ? null : e.id)}
                        className={cn(
                          'border-t border-ink-100 cursor-pointer transition-colors',
                          isSelected ? 'bg-brand-50' : 'hover:bg-ink-50',
                        )}
                      >
                        <td className="px-5 py-3.5 text-ink-700 font-medium whitespace-nowrap">
                          {formatDate(e.date)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="flex items-center justify-center w-6 h-6 rounded-md text-white"
                              style={{ backgroundColor: stormColors[e.type] }}
                            >
                              {stormIcons[e.type]}
                            </span>
                            <span className="font-medium text-ink-900">{e.type}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right text-ink-700 whitespace-nowrap">
                          {e.windSpeed} <span className="text-ink-400">mph</span>
                        </td>
                        <td className="px-5 py-3.5 text-right text-ink-700 whitespace-nowrap">{e.hailSize}</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-risk-high whitespace-nowrap">
                          {e.damageEstimate}
                        </td>
                        <td className="px-5 py-3.5 text-ink-600 whitespace-nowrap">{e.location}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-ink-100">
            {filteredEvents.length === 0 && (
              <div className="text-center py-10 text-ink-400 text-sm">
                No storm events match the selected filter.
              </div>
            )}
            {[...filteredEvents]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((e) => {
                const isSelected = selectedStorm === e.id;
                return (
                  <div
                    key={e.id}
                    onClick={() => setSelectedStorm(isSelected ? null : e.id)}
                    className={cn('p-4 cursor-pointer transition-colors', isSelected ? 'bg-brand-50' : 'hover:bg-ink-50')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="flex items-center justify-center w-6 h-6 rounded-md text-white"
                          style={{ backgroundColor: stormColors[e.type] }}
                        >
                          {stormIcons[e.type]}
                        </span>
                        <span className="font-semibold text-ink-900">{e.type}</span>
                      </span>
                      <span className="text-xs text-ink-500">{formatDate(e.date)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      <span className="text-ink-500">Wind: <span className="text-ink-800 font-medium">{e.windSpeed} mph</span></span>
                      <span className="text-ink-500">Hail: <span className="text-ink-800 font-medium">{e.hailSize}</span></span>
                      <span className="text-ink-500">Damage: <span className="text-risk-high font-semibold">{e.damageEstimate}</span></span>
                      <span className="text-ink-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.location}</span>
                    </div>
                    {isSelected && (
                      <p className="text-xs text-ink-600 mt-3 pt-3 border-t border-brand-200 leading-relaxed">
                        {e.description}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
