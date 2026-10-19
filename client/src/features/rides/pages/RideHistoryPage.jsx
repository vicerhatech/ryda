import { useEffect, useState } from 'react';

import { api } from '../../../shared/lib/api';

export default function RideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadRides() {
      try {
        const { data } = await api.get('/rides/my');
        if (isCurrent) setRides(data.rides || []);
      } catch (requestError) {
        if (isCurrent) setError(requestError.response?.data?.message || 'Unable to load your ride history.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadRides();
    return () => {
      isCurrent = false;
    };
  }, []);

  if (isLoading) return <p className="text-slate-600">Loading your rides…</p>;
  if (error) return <p className="text-red-600" role="alert">{error}</p>;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ride history</h1>
        <p className="mt-1 text-sm text-slate-600">View completed rides and rate your driver.</p>
      </div>

      {rides.length === 0 ? (
        <p className="rounded-xl bg-white p-5 text-slate-600 ring-1 ring-slate-200">You have no rides yet.</p>
      ) : (
        <div className="space-y-3">
          {rides.map((ride) => (
            <button
              key={ride._id}
              className="w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 hover:ring-emerald-500"
              onClick={() => setSelectedRide(ride)}
              type="button"
            >
              <span className="block font-semibold text-slate-900">{ride.pickup?.address} → {ride.destination?.address}</span>
              <span className="mt-1 block text-sm text-slate-600">{ride.status} · ₦{ride.grossFare}</span>
            </button>
          ))}
        </div>
      )}

      {selectedRide && <RideDetails ride={selectedRide} />}
    </section>
  );
}

function RideDetails({ ride }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitReview(event) {
    event.preventDefault();
    setMessage('');

    if (rating < 1 || rating > 5) {
      setMessage('Choose a rating from 1 to 5 stars.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/rides/${ride._id}/review`, { rating, comment });
      setMessage('Thanks for rating your driver.');
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Unable to submit your review.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Ride details</h2>
      <dl className="mt-3 space-y-2 text-sm text-slate-700">
        <div><dt className="font-medium">Pickup</dt><dd>{ride.pickup?.address}</dd></div>
        <div><dt className="font-medium">Destination</dt><dd>{ride.destination?.address}</dd></div>
        <div><dt className="font-medium">Status</dt><dd>{ride.status}</dd></div>
        <div><dt className="font-medium">Fare</dt><dd>₦{ride.grossFare}</dd></div>
      </dl>

      {ride.status === 'COMPLETED' && (
        <form className="mt-5 space-y-3 border-t border-slate-200 pt-5" onSubmit={submitReview}>
          <fieldset>
            <legend className="font-semibold text-slate-900">Rate your driver</legend>
            <div className="mt-2 flex gap-1" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button aria-label={`${star} star${star === 1 ? '' : 's'}`} className={`text-2xl ${star <= rating ? 'text-amber-400' : 'text-slate-300'}`} key={star} onClick={() => setRating(star)} type="button">★</button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm text-slate-700">
            Comment (optional)
            <textarea className="mt-1 w-full rounded-lg border border-slate-300 p-2" maxLength="500" onChange={(event) => setComment(event.target.value)} rows="3" value={comment} />
          </label>
          {message && <p className="text-sm text-slate-700" role="status">{message}</p>}
          <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white disabled:bg-emerald-300" disabled={isSubmitting} type="submit">{isSubmitting ? 'Submitting…' : 'Submit review'}</button>
        </form>
      )}
    </article>
  );
}
