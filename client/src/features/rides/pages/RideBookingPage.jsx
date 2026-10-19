import { useMemo, useState } from 'react';
import { api } from '../../../shared/lib/api';
import { RYDA_CONFIG } from '../../../shared/constants/rydaConfig.js';

const OFF_PLATFORM_PAYMENT_WARNING =
  'For your safety and transaction traceability, make payments only through Ryda. Payments made outside Ryda cannot be verified through our platform and are not covered by Ryda payment records or dispute support.';

const initialLocation = { address: '', latitude: '', longitude: '' };

export default function RideBookingPage() {
  const [pickup, setPickup] = useState(initialLocation);
  const [destination, setDestination] = useState(initialLocation);
  const [bookedSeats, setBookedSeats] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fare = useMemo(() => bookedSeats * RYDA_CONFIG.RIDE_FARE_PER_SEAT_NGN, [bookedSeats]);

  const updateLocation = (setter, field) => (event) => {
    setter((location) => ({ ...location, [field]: event.target.value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!pickup.address.trim() || !destination.address.trim()) {
      setError('Enter both your pickup point and destination.');
      return;
    }

    const coordinates = [pickup.latitude, pickup.longitude, destination.latitude, destination.longitude];
    if (coordinates.some((value) => value === '' || Number.isNaN(Number(value)))) {
      setError('Enter valid latitude and longitude for both locations.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/rides', {
        pickup: {
          address: pickup.address.trim(),
          latitude: Number(pickup.latitude),
          longitude: Number(pickup.longitude)
        },
        destination: {
          address: destination.address.trim(),
          latitude: Number(destination.latitude),
          longitude: Number(destination.longitude)
        },
        bookedSeats
      });
      setSuccess('Ride request sent. We will notify you when a driver accepts it.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to request a ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Book a Keke</h1>
        <p className="mt-1 text-sm text-slate-600">Choose your route and the number of seats you need.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <LocationFields label="Pickup" location={pickup} onChange={updateLocation(setPickup)} />
        <LocationFields label="Destination" location={destination} onChange={updateLocation(setDestination)} />

        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">Seats</legend>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((seatCount) => (
              <button
                key={seatCount}
                aria-pressed={bookedSeats === seatCount}
                className={`rounded-lg border px-3 py-3 text-left transition ${
                  bookedSeats === seatCount
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:border-emerald-400'
                }`}
                onClick={() => setBookedSeats(seatCount)}
                type="button"
              >
                <span className="block font-semibold">{seatCount} {seatCount === 1 ? 'seat' : 'seats'}</span>
                <span className="mt-1 block text-sm">₦{seatCount * RYDA_CONFIG.RIDE_FARE_PER_SEAT_NGN}</span>
                {seatCount === 4 && <span className="mt-1 block text-xs font-medium">Private Keke</span>}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Fare preview</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">₦{fare}</p>
          <p className="mt-1 text-xs text-slate-500">Final fare is confirmed by Ryda when your request is created.</p>
        </div>

        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" aria-label="Platform payment notice">
          <span className="font-semibold">Pay through Ryda</span>
          <p className="mt-1">{OFF_PLATFORM_PAYMENT_WARNING}</p>
        </aside>

        {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
        {success && <p className="text-sm font-medium text-emerald-700" role="status">{success}</p>}

        <button className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Requesting ride…' : 'Request a ride'}
        </button>
      </form>
    </section>
  );
}

function LocationFields({ label, location, onChange }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-900">{label}</legend>
      <label className="block text-sm text-slate-700">
        Address
        <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" onChange={onChange('address')} required value={location.address} />
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          Latitude
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" inputMode="decimal" onChange={onChange('latitude')} required type="number" value={location.latitude} />
        </label>
        <label className="text-sm text-slate-700">
          Longitude
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" inputMode="decimal" onChange={onChange('longitude')} required type="number" value={location.longitude} />
        </label>
      </div>
    </fieldset>
  );
}
