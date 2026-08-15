import { useState } from 'react';
import { cn } from '../utils/cn';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  value?: number;
}

interface InteractiveMapProps {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  className?: string;
  layers?: { id: string; label: string; color: string }[];
  activeLayer?: string;
  onLayerChange?: (layer: string) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  showLayers?: boolean;
  height?: string;
}

export function InteractiveMap({
  markers = [],
  className,
  layers = [],
  activeLayer,
  onLayerChange,
  onMarkerClick,
  showLayers = true,
  height = 'h-96',
}: InteractiveMapProps) {
  // Michigan bounding box for coordinate projection
  const minLat = 41.7;
  const maxLat = 45.5;
  const minLng = -87.0;
  const maxLng = -82.4;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={cn('relative rounded-xl overflow-hidden bg-ink-950', height, className)}>
      {/* Map background — stylized topography */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="terrain" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#16294d" />
            <stop offset="100%" stopColor="#0f1e3d" />
          </radialGradient>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#ffffff" strokeWidth="0.15" opacity="0.08" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#terrain)" />
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Michigan outline (simplified) */}
        <path
          d="M 30,8 L 25,12 L 22,20 L 20,28 L 18,35 L 16,42 L 18,50 L 22,55 L 28,58 L 35,60 L 42,62 L 50,63 L 58,62 L 65,60 L 70,55 L 72,48 L 75,40 L 78,35 L 80,28 L 78,20 L 75,15 L 70,10 L 62,7 L 55,6 L 48,7 L 40,8 Z"
          fill="#1e40af"
          fillOpacity="0.15"
          stroke="#3b82f6"
          strokeWidth="0.4"
          strokeOpacity="0.5"
        />

        {/* Upper Peninsula */}
        <path
          d="M 35,3 L 30,5 L 28,8 L 30,10 L 35,9 L 40,8 L 45,7 L 48,5 L 45,3 Z"
          fill="#1e40af"
          fillOpacity="0.15"
          stroke="#3b82f6"
          strokeWidth="0.4"
          strokeOpacity="0.5"
        />

        {/* Rivers */}
        <path d="M 40,25 Q 45,35 50,45 Q 55,50 60,55" fill="none" stroke="#60a5fa" strokeWidth="0.3" opacity="0.4" />
        <path d="M 55,15 Q 50,25 48,35 Q 46,42 50,50" fill="none" stroke="#60a5fa" strokeWidth="0.3" opacity="0.4" />

        {/* Lakes */}
        <ellipse cx="15" cy="30" rx="8" ry="12" fill="#1e40af" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="0.2" opacity="0.6" />
        <ellipse cx="82" cy="25" rx="10" ry="8" fill="#1e40af" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="0.2" opacity="0.6" />

        {/* Weather radar overlay (if layer active) */}
        {activeLayer === 'radar' && (
          <>
            <circle cx="50" cy="40" r="25" fill="#3b82f6" fillOpacity="0.1" />
            <circle cx="50" cy="40" r="18" fill="#f59e0b" fillOpacity="0.12" />
            <circle cx="50" cy="40" r="12" fill="#ef4444" fillOpacity="0.15" />
            <circle cx="50" cy="40" r="6" fill="#dc2626" fillOpacity="0.2" />
          </>
        )}

        {activeLayer === 'flood' && (
          <>
            <path d="M 35,30 Q 45,35 55,32 Q 60,38 58,45 Q 50,50 40,48 Q 33,42 35,30 Z" fill="#3b82f6" fillOpacity="0.2" stroke="#60a5fa" strokeWidth="0.3" />
            <path d="M 60,20 Q 68,25 70,35 Q 65,40 58,38" fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="0.3" />
          </>
        )}

        {activeLayer === 'storm' && (
          <>
            <path d="M 30,15 L 35,25 L 40,20 L 45,30 L 50,25 L 55,35 L 60,28 L 65,38" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" strokeDasharray="2,1" />
            <circle cx="45" cy="35" r="3" fill="#fbbf24" fillOpacity="0.3" />
            <circle cx="60" cy="25" r="4" fill="#fbbf24" fillOpacity="0.2" />
          </>
        )}

        {/* Markers */}
        {markers.map((m) => {
          const { x, y } = project(m.lat, m.lng);
          const isHovered = hovered === m.id;
          const markerColor = m.color ?? (m.value !== undefined ? (m.value >= 80 ? '#ef4444' : m.value >= 60 ? '#f59e0b' : m.value >= 30 ? '#3b82f6' : '#22c55e') : '#3b82f6');
          return (
            <g key={m.id} onClick={() => onMarkerClick?.(m)} onMouseEnter={() => setHovered(m.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              {isHovered && <circle cx={x} cy={y} r="4" fill={markerColor} fillOpacity="0.2" className="animate-pulse-ring" />}
              <circle cx={x} cy={y} r={isHovered ? 2.5 : 1.8} fill={markerColor} stroke="#ffffff" strokeWidth="0.4" className="transition-all duration-200" />
              {isHovered && m.label && (
                <g>
                  <rect x={x + 3} y={y - 4} width={m.label.length * 1.8 + 4} height="5" rx="1" fill="#0f172a" fillOpacity="0.9" />
                  <text x={x + 5} y={y - 0.5} fill="#ffffff" fontSize="2.5" fontWeight="600">
                    {m.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Layer controls */}
      {showLayers && layers.length > 0 && (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => onLayerChange?.(layer.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 backdrop-blur-md',
                activeLayer === layer.id
                  ? 'bg-white/90 text-ink-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20',
              )}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
              {layer.label}
            </button>
          ))}
        </div>
      )}

      {/* Compass */}
      <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
        <span className="text-white text-xs font-bold">N</span>
        <span className="absolute top-1 text-white/60 text-[8px]">↑</span>
      </div>

      {/* Scale */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-white/60 text-[10px]">
        <div className="w-12 h-0.5 bg-white/40" />
        <span>50 mi</span>
      </div>
    </div>
  );
}
