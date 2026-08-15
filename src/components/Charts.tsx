import { useId } from 'react';
import { cn } from '../utils/cn';

interface LineChartProps {
  data: { year: number; value: number }[];
  color?: string;
  height?: number;
  yLabel?: string;
  className?: string;
}

export function LineChart({ data, color = '#2563eb', height = 200, yLabel, className }: LineChartProps) {
  const gradId = useId();
  const width = 100;
  const padding = { top: 10, right: 5, bottom: 20, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding.left}
            y1={padding.top + t * chartH}
            x2={width - padding.right}
            y2={padding.top + t * chartH}
            stroke="#e2e8f0"
            strokeWidth="0.3"
            strokeDasharray="0.5"
          />
        ))}

        <path d={areaD} fill={`url(#${gradId})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="1.2" fill="#fff" stroke={color} strokeWidth="0.6" />
            <text x={p.x} y={height - 5} textAnchor="middle" fontSize="3" fill="#94a3b8" fontWeight="500">
              {p.year}
            </text>
          </g>
        ))}

        {yLabel && <text x={2} y={padding.top + 3} fontSize="3" fill="#94a3b8">{yLabel}</text>}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  className?: string;
  max?: number;
}

export function BarChart({ data, height = 200, className, max }: BarChartProps) {
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn('flex items-end justify-around gap-2', className)} style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / maxVal) * (height - 30);
        const color = d.color ?? (d.value >= 80 ? '#ef4444' : d.value >= 60 ? '#f59e0b' : d.value >= 30 ? '#3b82f6' : '#22c55e');
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs font-semibold text-ink-700">{d.value}</span>
            <div
              className="w-full rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
              style={{ height: `${h}px`, backgroundColor: color, minHeight: '4px' }}
            />
            <span className="text-[11px] text-ink-500 text-center leading-tight">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

export function Sparkline({ data, color = '#2563eb', height = 40, className }: SparklineProps) {
  const width = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('w-full', className)} preserveAspectRatio="none" style={{ height }}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  className?: string;
}

export function DonutChart({ segments, size = 160, className }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circumference;
          const circle = (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              className="transition-all duration-700 ease-out"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-ink-600">{seg.label}</span>
            <span className="text-sm font-semibold text-ink-900 ml-auto">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
