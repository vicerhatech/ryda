import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Ryda' },
  { to: '/payments', label: 'Payments' },
  { to: '/admin', label: 'Admin' }
];

export default function Navigation() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-5 px-4 py-4">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="font-medium text-slate-700">
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
