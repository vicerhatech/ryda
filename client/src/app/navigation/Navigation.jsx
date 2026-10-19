import { NavLink } from 'react-router-dom';
import { LogoutButton, useAuth } from '../../features/identity';

const links = [
  { to: '/', label: 'Ryda' },
  { to: '/rides', label: 'Book a ride' },
  { to: '/rides/history', label: 'Ride history' },
  { to: '/courier', label: 'Courier' },
  { to: '/driver', label: 'Driver dashboard' },
  { to: '/payments', label: 'Payments' },
  { to: '/admin', label: 'Admin' }
];

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-5 px-4 py-4">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="font-medium text-slate-700">
            {link.label}
          </NavLink>
        ))}
        <span className="ml-auto flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="font-medium text-slate-700">{user?.fullName || 'Profile'}</NavLink>
              {user?.role === 'DRIVER' && <NavLink to="/driver-verification" className="font-medium text-slate-700">Verification</NavLink>}
              <LogoutButton />
            </>
          ) : (
            <>
              <NavLink to="/login" className="font-medium text-slate-700">Log in</NavLink>
              <NavLink to="/register" className="font-medium text-teal-700">Register</NavLink>
            </>
          )}
        </span>
      </div>
    </nav>
  );
}
