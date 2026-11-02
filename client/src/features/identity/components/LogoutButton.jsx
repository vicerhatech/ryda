import { useAuth } from '../hooks/AuthContext';

export default function LogoutButton({ className = '' }) {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={logout}
      className={`rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${className}`}
    >
      Log out
    </button>
  );
}
