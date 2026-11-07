import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCourierSocket, leaveCourierRoom } from './courierSocket.js';

const ACTIVE_STATUSES = new Set(['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT']);

function coordinates(location) {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : null;
}

export function CourierLiveTracking({ courier, onCourierUpdate = () => {} }) {
  const [driverPosition, setDriverPosition] = useState(null);
  const [socketError, setSocketError] = useState('');
  const pickup = coordinates(courier?.pickup);
  const dropoff = coordinates(courier?.dropoff);
  const active = ACTIVE_STATUSES.has(courier?.status);

  useEffect(() => {
    if (!courier?._id || ['DELIVERED', 'CANCELLED'].includes(courier.status)) {
      setDriverPosition(null);
      return undefined;
    }
    const socket = getCourierSocket();
    const onLocation = (update) => {
      if (update.serviceId === String(courier._id)) setDriverPosition([update.latitude, update.longitude]);
    };
    const onAccepted = (update) => {
      if (update.courierId === String(courier._id)) onCourierUpdate((current) => ({ ...current, ...update }));
    };
    const onStatus = (update) => {
      if (update.courierId === String(courier._id)) onCourierUpdate((current) => ({ ...current, ...update }));
    };
    const onError = () => setSocketError('Live tracking connection is unavailable.');
    const joinRoom = () => socket.emit('courier:join', { courierId: courier._id }, (result) => {
      if (!result?.ok) setSocketError(result?.error || 'Unable to join courier tracking.');
    });
    socket.on('courier:location:update', onLocation);
    socket.on('courier:accepted', onAccepted);
    socket.on('courier:status:update', onStatus);
    socket.on('connect_error', onError);
    socket.on('connect', joinRoom);
    joinRoom();
    return () => {
      socket.off('courier:location:update', onLocation);
      socket.off('courier:accepted', onAccepted);
      socket.off('courier:status:update', onStatus);
      socket.off('connect_error', onError);
      socket.off('connect', joinRoom);
      leaveCourierRoom(courier._id);
    };
  }, [courier?._id, courier?.status, onCourierUpdate]);

  if (!courier) return null;
  if (!active) return <p className="mt-4 text-sm text-slate-600">Live tracking starts after a driver accepts this courier request.</p>;
  if (!pickup || !dropoff) return <p className="mt-4 text-sm text-slate-600">Map coordinates are unavailable for this courier request.</p>;
  const center = driverPosition || pickup;

  return <section className="mt-5"><h3 className="font-semibold">Live delivery tracking</h3>{socketError && <p role="alert" className="mt-2 text-sm text-rose-700">{socketError}</p>}<MapContainer center={center} zoom={15} className="mt-3 h-80 rounded-lg" scrollWheelZoom><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><Polyline positions={[pickup, dropoff]} pathOptions={{ color: '#6366f1' }} /><CircleMarker center={pickup} radius={8} pathOptions={{ color: '#16a34a' }}><Popup>Pickup: {courier.pickup.address}</Popup></CircleMarker><CircleMarker center={dropoff} radius={8} pathOptions={{ color: '#dc2626' }}><Popup>Drop-off: {courier.dropoff.address}</Popup></CircleMarker>{driverPosition && <CircleMarker center={driverPosition} radius={9} pathOptions={{ color: '#2563eb' }}><Popup>Driver location</Popup></CircleMarker>}</MapContainer></section>;
}

export function CourierDriverLocationPublisher({ courier, currentUserId }) {
  const [error, setError] = useState('');
  const assigned = courier?.driverId && String(courier.driverId) === String(currentUserId);
  const active = ACTIVE_STATUSES.has(courier?.status);

  useEffect(() => {
    if (!courier?._id || !assigned || !active || !navigator.geolocation) return undefined;
    const socket = getCourierSocket();
    const joinRoom = () => socket.emit('courier:join', { courierId: courier._id });
    socket.on('connect', joinRoom);
    joinRoom();
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => socket.emit('courier:location:update', { courierId: courier._id, latitude: coords.latitude, longitude: coords.longitude }),
      () => setError('Location permission was denied or unavailable.'),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off('connect', joinRoom);
      leaveCourierRoom(courier._id);
    };
  }, [courier?._id, assigned, active]);

  if (!assigned || !active) return null;
  return error ? <p role="alert" className="text-sm text-rose-700">{error}</p> : <p className="text-sm text-slate-600">Sharing your live location for this courier delivery.</p>;
}
