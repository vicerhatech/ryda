import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

import { useRideRoute } from '../hooks/useRideRoute';

const pickupIcon = createMarkerIcon('P', 'bg-emerald-600');
const destinationIcon = createMarkerIcon('D', 'bg-rose-600');
const driverIcon = createMarkerIcon('K', 'bg-sky-600');

export default function RideMap({ pickup, destination, driverLocation = null }) {
  const pickupPosition = toLatLng(pickup);
  const destinationPosition = toLatLng(destination);
  const driverPosition = toLatLng(driverLocation);
  const { route, routeNotice } = useRideRoute(pickup, destination);

  const mapPoints = useMemo(
    () => [pickupPosition, destinationPosition, driverPosition].filter(Boolean),
    [pickupPosition?.[0], pickupPosition?.[1], destinationPosition?.[0], destinationPosition?.[1], driverPosition?.[0], driverPosition?.[1]]
  );

  if (!pickupPosition || !destinationPosition) {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Enter pickup and destination coordinates to preview the ride map.
      </p>
    );
  }

  return (
    <section aria-label="Ride route map" className="space-y-2">
      <div className="h-80 overflow-hidden rounded-xl border border-slate-200 sm:h-96">
        <MapContainer center={pickupPosition} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitRideBounds points={mapPoints} />
          <Polyline pathOptions={{ color: '#047857', weight: 5 }} positions={route} />
          <Marker icon={pickupIcon} position={pickupPosition}>
            <Popup>Pickup: {pickup.address || 'Pickup point'}</Popup>
          </Marker>
          <Marker icon={destinationIcon} position={destinationPosition}>
            <Popup>Destination: {destination.address || 'Destination point'}</Popup>
          </Marker>
          {driverPosition && (
            <Marker icon={driverIcon} position={driverPosition}>
              <Popup>Your Keke</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      {routeNotice && <p className="text-xs text-slate-500">{routeNotice}</p>}
    </section>
  );
}

function FitRideBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [32, 32], maxZoom: 16 });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    }
  }, [map, points]);

  return null;
}

function toLatLng(location) {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : null;
}

function createMarkerIcon(label, backgroundClass) {
  return divIcon({
    className: 'ryda-map-marker',
    html: `<span class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${backgroundClass} text-xs font-bold text-white shadow">${label}</span>`,
    iconAnchor: [16, 16],
    iconSize: [32, 32]
  });
}
