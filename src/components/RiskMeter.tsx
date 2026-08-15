import { cn } from '../utils/cn';

interface RiskMeterProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RiskMeter({ score, label, size = 'md', showLabel = true }: RiskMeterProps) {
  const sizes = {
    sm: { ring: 'w-16 h-16', text: 'text-lg', stroke: 4 },
    md: { ring: 'w-24 h-24', text: 'text-2xl', stroke: 6 },
    lg: { ring: 'w-32 h-32', text: 'text-3xl', stroke: 8 },
  };
  const s = sizes[size];
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : score >= 30 ? '#3b82f6' : '#22c55e';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative', s.ring)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={s.stroke}
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold text-ink-900', s.text)}>{score}</span>
          <span className="text-[10px] text-ink-400 font-medium">/ 100</span>
        </div>
      </div>
      {showLabel && label && (
        <span className="text-xs font-medium text-ink-500">{label}</span>
      )}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
}

export function ProgressBar({ value, max = 100, label, showValue, color }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const autoColor =
    value >= 80 ? 'bg-risk-high' : value >= 60 ? 'bg-risk-medium' : value >= 30 ? 'bg-brand-500' : 'bg-risk-low';

  return (
    <div>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-ink-700">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-ink-900">{value}</span>}
        </div>
      )}
      <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color ?? autoColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'low' | 'medium' | 'high' | 'critical' | 'neutral' | 'brand';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    low: 'bg-green-50 text-green-700 border border-green-200',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    high: 'bg-red-50 text-red-700 border border-red-200',
    critical: 'bg-red-100 text-red-800 border border-red-300',
    neutral: 'bg-ink-100 text-ink-700 border border-ink-200',
    brand: 'bg-brand-50 text-brand-700 border border-brand-200',
  };
  return <span className={cn('badge', variants[variant], className)}>{children}</span>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({ label, value, icon, trend, trendUp, color = 'text-brand-600' }: StatCardProps) {
  return (
    <div className="card p-4 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-ink-900 mt-1">{value}</p>
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-ink-50', color)}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          <span className={cn('text-xs font-medium', trendUp ? 'text-risk-low' : 'text-risk-high')}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-xs text-ink-400">vs last year</span>
        </div>
      )}
    </div>
  );
}
