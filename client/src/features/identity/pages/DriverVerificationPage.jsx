import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { getAuthError, getMyDriverVerification, submitDriverVerification } from '../api/authApi';
import { useAuth } from '../hooks/AuthContext';

const INITIAL_VALUES = {
  vehicleNumber: '',
  vehicleImage: '',
  identityDocument: ''
};

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-800',
  APPROVED: 'bg-emerald-50 text-emerald-800',
  REJECTED: 'bg-rose-50 text-rose-800'
};

export default function DriverVerificationPage() {
  const { user, token, isAuthenticated, isRestoring } = useAuth();
  const [profile, setProfile] = useState(null);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== 'DRIVER') {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadVerification() {
      try {
        const existingProfile = await getMyDriverVerification(token);
        if (isMounted) {
          setProfile(existingProfile);
        }
      } catch (requestError) {
        if (requestError.response?.status !== 404 && isMounted) {
          setError(getAuthError(requestError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVerification();

    return () => {
      isMounted = false;
    };
  }, [token, user?.role]);

  if (isRestoring || isLoading) {
    return <p className="text-center text-sm text-slate-500">Loading verification status…</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'DRIVER') {
    return (
      <AuthLayout
        title="Driver verification"
        subtitle="Only Driver accounts can submit Keke verification details."
      />
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const submittedProfile = await submitDriverVerification(token, values);
      setProfile(submittedProfile);
    } catch (submissionError) {
      setError(getAuthError(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (profile) {
    return (
      <AuthLayout
        title="Driver verification"
        subtitle="Your verification has been submitted. You must wait for admin approval before going online."
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-medium text-slate-900">Verification status</p>
            <span className={`mt-2 inline-flex rounded-full px-3 py-1 font-semibold ${STATUS_STYLES[profile.verificationStatus]}`}>
              {profile.verificationStatus}
            </span>
          </div>
          <p>Vehicle number: {profile.vehicleNumber}</p>
          <p className="rounded-lg bg-slate-50 p-3 text-slate-600">
            Additional submissions are disabled while this verification record is under review.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your Keke"
      subtitle="Submit your vehicle details for review. You must wait for admin approval before going online."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
            {error}
          </p>
        )}
        <label className="block text-sm font-medium text-slate-700">
          Vehicle number
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            type="text"
            name="vehicleNumber"
            value={values.vehicleNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Keke image URL
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            type="url"
            name="vehicleImage"
            value={values.vehicleImage}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/..."
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Identity document URL
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            type="url"
            name="identityDocument"
            value={values.identityDocument}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/..."
            required
          />
        </label>
        <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          Upload your files to the team Cloudinary account and paste the HTTPS delivery URLs here. Ryda stores URLs only, never image files in the database.
        </p>
        <button
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting verification…' : 'Submit for verification'}
        </button>
      </form>
    </AuthLayout>
  );
}
