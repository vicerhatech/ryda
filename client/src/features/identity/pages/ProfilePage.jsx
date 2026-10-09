import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import LogoutButton from '../components/LogoutButton';
import { useAuth } from '../hooks/AuthContext';

function profileValues(user) {
  return {
    fullName: user?.fullName || '',
    phone: user?.phone || ''
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated, isRestoring, updateProfile } = useAuth();
  const [values, setValues] = useState(() => profileValues(user));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(profileValues(user));
  }, [user]);

  if (isRestoring) {
    return <p className="text-center text-sm text-slate-500">Loading your profile…</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await updateProfile(values);
      setSuccess('Your profile has been updated.');
    } catch (profileError) {
      setError(profileError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Your profile"
      subtitle="Keep your contact details current so Ryda can support your bookings."
      footer={<LogoutButton />}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
            {success}
          </p>
        )}
        <label className="block text-sm font-medium text-slate-700">
          Email address
          <input
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
            value={user.email}
            readOnly
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Account type
          <input
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
            value={user.role}
            readOnly
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone number
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            autoComplete="tel"
            required
          />
        </label>
        <button
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving changes…' : 'Save changes'}
        </button>
      </form>
    </AuthLayout>
  );
}
