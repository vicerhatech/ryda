import { useDriverRideLocationPublisher } from '../hooks/useDriverRideLocationPublisher';

export default function DriverRideLocationPublisher(props) {
  const { locationError } = useDriverRideLocationPublisher(props);

  return locationError ? <p className="text-sm text-red-600" role="alert">{locationError}</p> : null;
}
