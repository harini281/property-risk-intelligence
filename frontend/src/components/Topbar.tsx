import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, ChevronRight, CloudSun, Loader2 } from 'lucide-react';
import { getWeather } from '../services/api';
import type { PropertyRiskApiResponse } from '../types/risk';

interface TopbarProps {
  onMenuClick: () => void;
  breadcrumbs?: { label: string; to?: string }[];
}

export function Topbar({ onMenuClick, breadcrumbs = [] }: TopbarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<PropertyRiskApiResponse['weather'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getWeather(42.2808, -83.743)
      .then((data) => {
        if (!active) return;
        if (!data.success) {
          setWeather(null);
          setError(true);
          return;
        }
        setWeather(data);
        setError(false);
      })
      .catch(() => {
        if (!active) return;
        setWeather(null);
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/app/search?q=${encodeURIComponent(query)}`);
  };

  const temperatureF = weather?.temperatureCelsius == null
    ? null
    : Math.round((weather.temperatureCelsius * 9) / 5 + 32);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-xl border-b border-ink-200/60 flex items-center px-4 lg:px-6 gap-4">
      <button onClick={onMenuClick} className="lg:hidden text-ink-600">
        <Menu className="w-6 h-6" />
      </button>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="hidden md:flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-ink-300" />}
              <button
                onClick={() => bc.to && navigate(bc.to)}
                className={cn(bc.to ? 'text-ink-500 hover:text-ink-900' : 'text-ink-900 font-medium')}
              >
                {bc.label}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto lg:mx-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search address, city, or ZIP..."
            className="w-full pl-10 pr-4 py-2 bg-ink-50 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>
      </form>

      {/* Weather widget */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-ink-50 rounded-lg border border-ink-200">
        <CloudSun className="w-5 h-5 text-brand-500" />
        <div className="text-right">
          {loading ? (
            <>
              <p className="text-sm font-semibold text-ink-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> —
              </p>
              <p className="text-[10px] text-ink-400">Loading…</p>
            </>
          ) : weather && !error ? (
            <>
              <p className="text-sm font-semibold text-ink-900">
                {temperatureF == null ? '—' : `${temperatureF}°F`}
              </p>
              <p className="text-[10px] text-ink-500">{weather.location ?? 'Live location'}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-ink-400">—</p>
              <p className="text-[10px] text-ink-400">Weather unavailable</p>
            </>
          )}
        </div>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg hover:bg-ink-100 transition-colors">
        <Bell className="w-5 h-5 text-ink-600" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-risk-high rounded-full ring-2 ring-white" />
      </button>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
        A
      </div>
    </header>
  );
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}