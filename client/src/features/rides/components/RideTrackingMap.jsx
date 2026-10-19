import { useRiderRideTracking } from '../hooks/useRiderRideTracking';
import RideMap from './RideMap';

export default function RideTrackingMap({ ride, accessToken }) {
  const { driverLocation, connectionError } = useRiderRideTracking({ ride, accessToken });

  if (!ride) return null;

  return (
    <section className="space-y-2">
      <RideMap pickup={ride.pickup} destination={ride.destination} driverLocation={driverLocation} />
      {connectionError && <p className="text-sm text-red-600" role="alert">{connectionError}</p>}
    </section>
  );
}
