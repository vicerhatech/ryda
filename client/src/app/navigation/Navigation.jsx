import { NavLink } from 'react-router-dom';
import { LogoutButton, useAuth } from '../../features/identity';

const links = [
  { to: '/', label: 'Ryda' },
  { to: '/rides', label: 'Book a ride', roles: ['RIDER'] },
  { to: '/rides/history', label: 'Ride history', roles: ['RIDER'] },
  { to: '/courier', label: 'Courier', roles: ['RIDER'] },
  { to: '/driver', label: 'Driver dashboard', roles: ['DRIVER'] },
  { to: '/payments', label: 'Payments', roles: ['DRIVER'] },
  { to: '/admin', label: 'Admin', roles: ['ADMIN'] }
];

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-5 px-4 py-4">
        {links.filter((link) => !link.roles || link.roles.includes(user?.role)).map((link) => (
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
