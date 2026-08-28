import React, { useEffect, useRef } from 'react';
import { Shipment } from '../../types';
import L from 'leaflet';

interface ShipmentMapProps {
  shipment: Shipment;
  height?: string;
}

export const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipment, height = '400px' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = shipment.currentCoordinates?.lat || 40.7128;
    const defaultLng = shipment.currentCoordinates?.lng || -74.0060;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([defaultLat, defaultLng], 4);

    mapInstanceRef.current = map;

    // Premium light CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const waypoints = shipment.routeWaypoints || [];
    const latLngs: L.LatLngExpression[] = [];

    // Custom HTML Marker Icons
    const createCustomIcon = (type: 'origin' | 'current' | 'waypoint' | 'destination', label: string) => {
      let colorClass = 'bg-blue-600';
      let ping = '';
      if (type === 'origin') colorClass = 'bg-emerald-600';
      if (type === 'destination') colorClass = 'bg-rose-600';
      if (type === 'current') {
        colorClass = 'bg-blue-600 ring-4 ring-blue-300';
        ping = '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>';
      }

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${colorClass} text-white text-xs font-bold shadow-lg border-2 border-white">
            ${ping}
            <span class="relative">${label}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });
    };

    // Add Waypoints
    waypoints.forEach((wp, idx) => {
      latLngs.push([wp.lat, wp.lng]);
      const isFirst = idx === 0;
      const isLast = idx === waypoints.length - 1;
      const isCurrent = Math.abs(wp.lat - defaultLat) < 0.05 && Math.abs(wp.lng - defaultLng) < 0.05;

      const markerType = isCurrent ? 'current' : isFirst ? 'origin' : isLast ? 'destination' : 'waypoint';
      const label = isFirst ? 'A' : isLast ? 'B' : String(idx + 1);

      const marker = L.marker([wp.lat, wp.lng], {
        icon: createCustomIcon(markerType, label),
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <div class="text-xs uppercase tracking-wider font-semibold text-slate-500">${isCurrent ? 'Current Live Location' : isFirst ? 'Origin Point' : isLast ? 'Destination' : 'Transit Hub'}</div>
          <div class="font-bold text-slate-900 text-sm mt-0.5">${wp.name}</div>
          <div class="text-xs text-slate-600 mt-1">Status: <span class="font-medium ${wp.passed ? 'text-emerald-600' : 'text-amber-600'}">${wp.passed ? 'Checkpoint Cleared' : 'En Route / Upcoming'}</span></div>
        </div>
      `);
    });

    // Fallback if no waypoints exist: add single current location marker
    if (waypoints.length === 0) {
      latLngs.push([defaultLat, defaultLng]);
      const marker = L.marker([defaultLat, defaultLng], {
        icon: createCustomIcon('current', '📍'),
      }).addTo(map);
      marker.bindPopup(`
        <div class="p-2">
          <div class="font-bold text-sm text-slate-900">${shipment.currentLocation}</div>
          <div class="text-xs text-slate-600 mt-0.5">Live Checkpoint Telemetry</div>
        </div>
      `);
    }

    // Draw Polyline Route
    if (latLngs.length > 1) {
      L.polyline(latLngs, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 8',
      }).addTo(map);

      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    } else {
      map.setView([defaultLat, defaultLng], 6);
    }

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [shipment]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-semibold text-slate-800">Live Telemetry Gateway</span>
      </div>
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 shadow-md">
        Coords: {shipment.currentCoordinates?.lat?.toFixed(4)}, {shipment.currentCoordinates?.lng?.toFixed(4)}
      </div>
    </div>
  );
};
