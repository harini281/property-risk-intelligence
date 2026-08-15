import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/Card';
import { Badge } from '../components/RiskMeter';
import { InteractiveMap } from '../components/InteractiveMap';
import { searchProperties, type Property } from '../data/mockData';
import { getRiskLabel } from '../data/mockData';

export default function PropertySearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [results, setResults] = useState<Property[]>([]);

  useEffect(() => {
    setResults(searchProperties(query));
  }, [query]);

  const markers = results.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.address,
    value: p.overallRisk,
  }));

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Property Search' }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Property Search</h1>
          <p className="text-sm text-ink-500 mt-1">Search any address to get instant risk intelligence</p>
        </div>

        {/* Search bar */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter address, city, or ZIP code..."
                className="input pl-11 py-3 text-base"
                autoFocus
              />
            </div>
          </div>
        </Card>

        {/* Map */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-ink-200/60">
            <h3 className="text-sm font-semibold text-ink-900">Map View</h3>
            <p className="text-xs text-ink-500">{results.length} properties found</p>
          </div>
          <InteractiveMap
            markers={markers}
            onMarkerClick={(m) => navigate(`/app/property/${m.id}`)}
            showLayers={false}
            height="h-80"
          />
        </Card>

        {/* Results */}
        <div>
          <h3 className="text-sm font-semibold text-ink-900 mb-3">Matching Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.length === 0 ? (
              <Card className="col-span-full text-center py-12">
                <p className="text-ink-500">No properties found. Try a different search.</p>
              </Card>
            ) : (
              results.map((p) => (
                <Card key={p.id} hover onClick={() => navigate(`/app/property/${p.id}`)}>
                  <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                    <img src={p.image} alt={p.address} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge variant={p.overallRisk >= 80 ? 'critical' : p.overallRisk >= 60 ? 'high' : p.overallRisk >= 30 ? 'brand' : 'low'}>
                        {getRiskLabel(p.overallRisk)} Risk
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-ink-900">{p.address}</h4>
                      <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {p.city}, {p.state} {p.zip}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-ink-900">{p.overallRisk}</p>
                      <p className="text-[10px] text-ink-400">Risk Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-ink-100 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {p.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>
                    <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.sqft.toLocaleString()} sqft</span>
                    <span className="ml-auto flex items-center gap-1 text-brand-600 font-medium">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
