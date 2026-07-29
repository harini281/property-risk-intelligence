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

/**
 * An interactive OpenStreetMap view. The previous coordinate projection was
 * fixed to Michigan, which placed any searched address outside the visible map.
 */
export function InteractiveMap({
  markers = [], center, className, layers = [], activeLayer, onLayerChange,
  onMarkerClick, showLayers = true, height = 'h-96',
}: InteractiveMapProps) {
  const mapCenter = center ?? (markers.length ? { lat: markers[0].lat, lng: markers[0].lng } : { lat: 42.2808, lng: -83.743 });
  const latitudes = markers.map((marker) => marker.lat);
  const longitudes = markers.map((marker) => marker.lng);
  const span = markers.length > 1
    ? Math.max(0.08, Math.max(...latitudes) - Math.min(...latitudes), Math.max(...longitudes) - Math.min(...longitudes)) * 0.75
    : 0.04;
  const bounds = [mapCenter.lng - span, mapCenter.lat - span, mapCenter.lng + span, mapCenter.lat + span]
    .map((value) => value.toFixed(5)).join('%2C');
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`;

  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-ink-950', height, className)}>
      <iframe key={mapUrl} title="Interactive OpenStreetMap" src={mapUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" />

      {showLayers && layers.length > 0 && (
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {layers.map((layer) => (
            <button key={layer.id} onClick={() => onLayerChange?.(layer.id)} className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all',
              activeLayer === layer.id ? 'bg-white/90 text-ink-900 shadow-lg' : 'bg-ink-950/70 text-white hover:bg-ink-950/90',
            )}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: layer.color }} />{layer.label}
            </button>
          ))}
        </div>
      )}

      {markers.length > 1 && (
        <div className="absolute bottom-3 left-3 max-w-[75%] rounded-lg bg-ink-950/80 p-2 text-xs text-white backdrop-blur-md">
          {markers.map((marker) => (
            <button key={marker.id} onClick={() => onMarkerClick?.(marker)} className="mr-2 hover:text-brand-200">
              {marker.label ?? marker.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
