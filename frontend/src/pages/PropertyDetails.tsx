import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Maximize, Calendar, Download, Share2, FileText,
  Waves, CloudHail, Wind, CloudLightning, Flame, CheckCircle2, Brain, AlertTriangle,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { RiskMeter, ProgressBar, Badge } from '../components/RiskMeter';
import { InteractiveMap } from '../components/InteractiveMap';
import { BarChart } from '../components/Charts';
import { getPropertyById, getRiskLabel } from '../data/mockData';
import { supabase } from '../lib/supabase';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = id ? getPropertyById(id) : undefined;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (!property) return;
      const { data } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('address', property.address)
        .maybeSingle();
      setSaved(!!data);
    };
    checkSaved();
  }, [property]);

  if (!property) {
    return (
      <AppLayout>
        <Card className="text-center py-12">
          <p className="text-ink-500">Property not found.</p>
          <button onClick={() => navigate('/app/search')} className="btn-primary mt-4">Back to Search</button>
        </Card>
      </AppLayout>
    );
  }

  const riskBars = [
    { label: 'Flood Risk', value: property.risks.flood, icon: <Waves className="w-4 h-4" /> },
    { label: 'Hail Risk', value: property.risks.hail, icon: <CloudHail className="w-4 h-4" /> },
    { label: 'Wind Risk', value: property.risks.wind, icon: <Wind className="w-4 h-4" /> },
    { label: 'Hurricane Risk', value: property.risks.hurricane, icon: <CloudLightning className="w-4 h-4" /> },
    { label: 'Wildfire Risk', value: property.risks.wildfire, icon: <Flame className="w-4 h-4" /> },
  ];

  const riskBarData = riskBars.map((r) => ({ label: r.label.replace(' Risk', ''), value: r.value }));

  const handleSave = async () => {
    if (saved) {
      await supabase.from('saved_properties').delete().eq('address', property.address);
      setSaved(false);
    } else {
      await supabase.from('saved_properties').insert({
        address: property.address,
        risk_score: property.overallRisk,
      });
      setSaved(true);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Property Search', to: '/app/search' }, { label: property.address }]}>
      <div className="space-y-6">
        {/* Hero image */}
        <div className="relative h-64 rounded-xl overflow-hidden">
          <img src={property.image} alt={property.address} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-2xl font-bold">{property.address}</h1>
            <p className="flex items-center gap-1.5 text-sm text-white/80 mt-1">
              <MapPin className="w-4 h-4" /> {property.city}, {property.state} {property.zip}
            </p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleSave} className={saved ? 'btn-primary' : 'btn-secondary'}>
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
            <RiskMeter score={property.overallRisk} size="lg" showLabel={false} />
            <Badge
              variant={property.overallRisk >= 80 ? 'critical' : property.overallRisk >= 60 ? 'high' : property.overallRisk >= 30 ? 'brand' : 'low'}
              className="mt-4"
            >
              {getRiskLabel(property.overallRisk)} Risk
            </Badge>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="Property Information" icon={<FileText className="w-5 h-5" />} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="Year Built" value={String(property.yearBuilt)} />
              <InfoItem icon={<Bed className="w-4 h-4" />} label="Bedrooms" value={String(property.beds)} />
              <InfoItem icon={<Bath className="w-4 h-4" />} label="Bathrooms" value={String(property.baths)} />
              <InfoItem icon={<Maximize className="w-4 h-4" />} label="Square Feet" value={property.sqft.toLocaleString()} />
              <InfoItem label="Property Type" value={property.propertyType} />
              <InfoItem label="Last Storm Event" value={property.lastStormEvent} />
              <InfoItem label="Storm Events (since 2008)" value={String(property.stormEventCount)} />
              <InfoItem label="Risk Level" value={getRiskLabel(property.overallRisk)} />
            </div>
          </Card>
        </div>

        {/* Risk breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Risk Breakdown" subtitle="Peril-specific analysis" icon={<AlertTriangle className="w-5 h-5" />} />
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
          </Card>

          <Card>
            <CardHeader title="Risk Comparison" subtitle="Visual breakdown" />
            <BarChart data={riskBarData} height={220} />
          </Card>
        </div>

        {/* AI Summary + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="AI Summary" subtitle="Generated by RiskIntel AI" icon={<Brain className="w-5 h-5" />} />
            <div className="p-4 bg-brand-50/50 rounded-lg border border-brand-100">
              <p className="text-sm text-ink-700 leading-relaxed italic">"{property.aiSummary}"</p>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-ink-400">
              <Brain className="w-3.5 h-3.5" /> Powered by 30+ data sources and historical analysis
            </div>
          </Card>

          <Card>
            <CardHeader title="Recommendations" subtitle="Actionable next steps" icon={<CheckCircle2 className="w-5 h-5" />} />
            <div className="space-y-2.5">
              {property.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-ink-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-risk-low shrink-0 mt-0.5" />
                  <span className="text-sm text-ink-700">{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-ink-200/60">
            <h3 className="text-sm font-semibold text-ink-900">Location Map</h3>
          </div>
          <InteractiveMap
            markers={[{ id: property.id, lat: property.lat, lng: property.lng, label: property.address, value: property.overallRisk }]}
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
