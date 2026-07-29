import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Loader2, CheckCircle2, Clock, Home, Shield, HardHat, TrendingUp } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { Badge } from '../components/RiskMeter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Report {
  id: string;
  address: string;
  report_type: string;
  risk_score: number | null;
  summary: string | null;
  status: string;
  created_at: string;
}

const reportTypes = [
  { value: 'homeowner', label: 'Homeowner', icon: Home, description: 'Property risk overview, recommendations, and maintenance guidance' },
  { value: 'insurance', label: 'Insurance', icon: Shield, description: 'Detailed risk assessment for underwriting and claims' },
  { value: 'contractor', label: 'Contractor', icon: HardHat, description: 'Damage assessment and repair demand analysis' },
  { value: 'investor', label: 'Investor', icon: TrendingUp, description: 'Long-term climate risk and property value impact' },
];

export default function Reports() {
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [reportType, setReportType] = useState('homeowner');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setReports(data ?? []);
    }
  };

  const handleGenerate = async () => {
    if (!address.trim()) {
      setError('Please enter an address.');
      return;
    }
    setError(null);
    setGenerating(true);

    const riskScore = Math.floor(Math.random() * 60) + 35;
    const summaries: Record<string, string> = {
      homeowner: `Property at ${address} has an overall risk score of ${riskScore}/100. Key recommendations include roof inspection, gutter maintenance, and sump pump evaluation.`,
      insurance: `Underwriting assessment for ${address}: Risk score ${riskScore}/100. Primary perils include hail and wind. Estimated annual claim probability: ${(riskScore * 0.8).toFixed(0)}%.`,
      contractor: `Repair demand analysis for ${address}: Roof damage likelihood ${riskScore}%, with estimated repair costs ranging $8K-$45K depending on storm severity.`,
      investor: `Climate risk projection for ${address}: 30-year outlook shows ${riskScore > 60 ? 'elevated' : 'moderate'} risk with potential ${riskScore > 70 ? '5-12%' : '2-5%'} property value impact from climate factors.`,
    };

    const { error: insertError } = await supabase.from('reports').insert({
      address: address.trim(),
      report_type: reportType,
      risk_score: riskScore,
      summary: summaries[reportType],
      status: 'completed',
    });

    setGenerating(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      setAddress('');
      fetchReports();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('reports').delete().eq('id', id);
    setReports(reports.filter((r) => r.id !== id));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTypeMeta = (type: string) => reportTypes.find((t) => t.value === type) ?? reportTypes[0];

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Reports' }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Reports</h1>
          <p className="text-sm text-ink-500 mt-1">Generate and manage property risk reports</p>
        </div>

        {/* Generate Report */}
        <Card>
          <CardHeader title="Generate Property Report" subtitle="Create a comprehensive risk report for any address" icon={<FileText className="w-5 h-5" />} />
          <div className="space-y-5">
            <div>
              <label className="label" htmlFor="report-address">Property Address</label>
              <input
                id="report-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Main Street, Ann Arbor, MI 48104"
                className="input"
              />
            </div>

            <div>
              <label className="label">Report Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  const selected = reportType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setReportType(type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        selected
                          ? 'border-brand-500 bg-brand-50/50 shadow-card'
                          : 'border-ink-200 hover:border-ink-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${selected ? 'text-brand-600' : 'text-ink-500'}`} />
                      <p className={`text-sm font-semibold ${selected ? 'text-brand-700' : 'text-ink-900'}`}>{type.label}</p>
                      <p className="text-xs text-ink-500 mt-1 leading-snug">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button onClick={handleGenerate} disabled={generating} className="btn-primary">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </Card>

        {/* Saved Reports */}
        <Card>
          <CardHeader
            title="Generated Reports"
            subtitle={`${reports.length} report${reports.length !== 1 ? 's' : ''} total`}
            icon={<CheckCircle2 className="w-5 h-5" />}
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-ink-400" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-ink-300 mx-auto mb-3" />
              <p className="text-sm text-ink-500">No reports yet. Generate your first report above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const typeMeta = getTypeMeta(report.report_type);
                const Icon = typeMeta.icon;
                return (
                  <div
                    key={report.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-ink-200 hover:border-ink-300 hover:shadow-card transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-ink-50 rounded-lg flex items-center justify-center text-ink-500 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-ink-900">{report.address}</h4>
                        <Badge variant="brand">{typeMeta.label}</Badge>
                        {report.status === 'completed' && (
                          <Badge variant="low">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </Badge>
                        )}
                      </div>

                      {report.summary && (
                        <p className="text-xs text-ink-500 mt-1.5 line-clamp-2">{report.summary}</p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-ink-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDate(report.created_at)}
                        </span>
                        {report.risk_score !== null && (
                          <span className="font-medium text-ink-600">
                            Risk Score: <span className={`font-bold ${report.risk_score >= 70 ? 'text-risk-high' : report.risk_score >= 50 ? 'text-risk-medium' : 'text-risk-low'}`}>{report.risk_score}/100</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button className="btn-ghost" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="btn-ghost hover:text-risk-high"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {user && (
          <p className="text-xs text-ink-400 text-center">
            Reports are saved to your account and persist across sessions.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
