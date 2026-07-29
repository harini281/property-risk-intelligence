import {
  Brain,
  Cpu,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Zap,
  Database,
  ShieldCheck,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { ProgressBar, Badge } from '../components/RiskMeter';
import { Sparkline, LineChart, BarChart } from '../components/Charts';
import { aiPredictions, type AIPrediction } from '../data/mockData';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Color used for the large probability number, sparkline, and progress bar. */
function probabilityColor(pct: number): string {
  if (pct >= 70) return '#ef4444'; // red
  if (pct >= 50) return '#f59e0b'; // amber
  if (pct >= 30) return '#2563eb'; // brand blue
  return '#22c55e'; // green
}

/** ProgressBar `color` prop accepts a bg-* utility class. */
function progressBarColor(pct: number): string {
  if (pct >= 70) return 'bg-risk-high';
  if (pct >= 50) return 'bg-risk-medium';
  if (pct >= 30) return 'bg-brand-500';
  return 'bg-risk-low';
}

/** Badge variant for the confidence score. */
function confidenceVariant(conf: number): 'low' | 'medium' | 'high' | 'brand' {
  if (conf >= 85) return 'high';
  if (conf >= 75) return 'brand';
  if (conf >= 60) return 'medium';
  return 'low';
}

/** Whether the trend series is rising or falling overall. */
function trendDirection(trend: number[]): 'up' | 'down' | 'flat' {
  if (trend.length < 2) return 'flat';
  const delta = trend[trend.length - 1] - trend[0];
  if (delta > 1) return 'up';
  if (delta < -1) return 'down';
  return 'flat';
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function PredictionCard({ prediction }: { prediction: AIPrediction }) {
  const color = probabilityColor(prediction.probability);
  const dir = trendDirection(prediction.trend);

  return (
    <Card className="flex flex-col gap-4" hover>
      {/* Label + timeframe */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 leading-snug">
            {prediction.label}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-ink-500">
            <Clock className="w-3.5 h-3.5" />
            {prediction.timeframe}
          </div>
        </div>
        <Badge variant={confidenceVariant(prediction.confidence)}>
          {prediction.confidence}% conf.
        </Badge>
      </div>

      {/* Big probability + sparkline */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-4xl font-bold leading-none"
              style={{ color }}
            >
              {prediction.probability}
            </span>
            <span
              className="text-lg font-semibold"
              style={{ color }}
            >
              %
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-xs font-medium">
            {dir === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5 text-risk-medium" />
            ) : dir === 'down' ? (
              <TrendingDown className="w-3.5 h-3.5 text-risk-low" />
            ) : (
              <Activity className="w-3.5 h-3.5 text-ink-400" />
            )}
            <span
              className={
                dir === 'up'
                  ? 'text-risk-medium'
                  : dir === 'down'
                    ? 'text-risk-low'
                    : 'text-ink-500'
              }
            >
              {dir === 'up'
                ? 'Trending up'
                : dir === 'down'
                  ? 'Trending down'
                  : 'Stable'}
            </span>
          </div>
        </div>
        <div className="w-28 shrink-0">
          <Sparkline data={prediction.trend} color={color} height={44} />
        </div>
      </div>

      {/* Probability progress bar */}
      <ProgressBar
        value={prediction.probability}
        color={progressBarColor(prediction.probability)}
      />

      {/* Description */}
      <p className="text-xs text-ink-500 leading-relaxed">
        {prediction.description}
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function AIPredictions() {
  // Model performance metrics derived from the prediction set.
  const avgConfidence = Math.round(
    aiPredictions.reduce((sum, p) => sum + p.confidence, 0) /
      aiPredictions.length,
  );
  const highRiskCount = aiPredictions.filter((p) => p.probability >= 50).length;

  const performanceData = aiPredictions.map((p) => ({
    label: p.label
      .replace(/Probability|Risk/g, '')
      .replace(/\(.*?\)/g, '')
      .trim()
      .split(' ')[0],
    value: p.confidence,
  }));

  // Confidence trend over model retraining cycles (synthetic but stable).
  const confidenceTrend = [
    { year: 2020, value: 72 },
    { year: 2021, value: 76 },
    { year: 2022, value: 79 },
    { year: 2023, value: 82 },
    { year: 2024, value: 84 },
  ];

  const insights = [
    {
      icon: TrendingUp,
      tone: 'text-risk-medium',
      text: `Roof Replacement Probability (${aiPredictions[1].probability}%) is the highest predicted event — driven by an aging roof and repeated hail exposure. Recommend proactive inspection within 6 months.`,
    },
    {
      icon: ShieldCheck,
      tone: 'text-brand-600',
      text: `Average model confidence is ${avgConfidence}% across ${aiPredictions.length} active predictions, with the strongest confidence on roof and power outage models.`,
    },
    {
      icon: Activity,
      tone: 'text-risk-high',
      text: `${highRiskCount} of ${aiPredictions.length} predictions exceed 50% probability, indicating an elevated combined risk profile for the upcoming storm season.`,
    },
    {
      icon: Zap,
      tone: 'text-amber-500',
      text: 'Power Outage Probability is rising sharply — grid infrastructure age and vegetation proximity are the dominant contributing factors in the current model run.',
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', to: '/app' },
        { label: 'AI Predictions' },
      ]}
    >
      <div className="space-y-6">
        {/* ---------------------------------------------------------- */}
        {/* Header                                                     */}
        {/* ---------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
              <Brain className="w-7 h-7 text-brand-600" />
              AI Prediction Center
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Machine learning risk predictions powered by 30+ data sources
            </p>
          </div>
          <Badge variant="brand">
            <Cpu className="w-3 h-3" />
            v4.2 Model
          </Badge>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Engine status banner                                       */}
        {/* ---------------------------------------------------------- */}
        <div className="relative overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 via-brand-50/60 to-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-600" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Engine Active
                </p>
                <p className="text-xs text-ink-500">
                  Continuously learning · last inference 14 seconds ago
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-600">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-500" />
                32 data sources
              </span>
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-brand-500" />
                {avgConfidence}% avg confidence
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-500" />
                {aiPredictions.length} active predictions
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Prediction cards grid                                      */}
        {/* ---------------------------------------------------------- */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-900">
              Active Predictions
            </h2>
            <span className="text-xs text-ink-500">
              {aiPredictions.length} models · refreshed hourly
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiPredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Model performance + AI insights                            */}
        {/* ---------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Model performance */}
          <Card>
            <CardHeader
              title="Model Performance"
              subtitle="Per-prediction confidence scores"
              icon={<Target className="w-5 h-5" />}
              action={
                <Badge variant="brand">
                  <TrendingUp className="w-3 h-3" />
                  {avgConfidence}% avg
                </Badge>
              }
            />
            <BarChart data={performanceData} height={180} max={100} />
            <div className="mt-5 pt-4 border-t border-ink-200/60">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-ink-700 uppercase tracking-wide">
                  Confidence trend (5 yr)
                </p>
                <span className="text-xs text-ink-500">+12% since 2020</span>
              </div>
              <LineChart
                data={confidenceTrend}
                color="#2563eb"
                height={120}
                yLabel="%"
              />
            </div>
          </Card>

          {/* AI insights */}
          <Card>
            <CardHeader
              title="AI Insights"
              subtitle="Generated summary of current prediction landscape"
              icon={<Lightbulb className="w-5 h-5" />}
            />
            <div className="space-y-3">
              {insights.map((insight, idx) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-ink-50/60 border border-ink-200/60"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 ${insight.tone}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-ink-600 leading-relaxed">
                      {insight.text}
                    </p>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              View full model report
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
