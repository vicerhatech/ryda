import { Route, Routes } from 'react-router-dom';
import DriverWalletPage from '../features/payments/DriverWalletPage';
import AdminDashboard from '../features/admin/AdminDashboard';
import { DriverVerificationPage, LoginPage, ProfilePage, RegisterPage } from '../features/identity';

function Home() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Ryda</h1>
      <p className="mt-2 text-slate-600">Campus Keke rides and courier delivery.</p>
    </section>
  );
}

function Placeholder({ title }) {
  return <h1 className="text-2xl font-semibold">{title} is coming soon.</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/driver-verification" element={<DriverVerificationPage />} />
      {/* Feature owners replace these baseline placeholders when their routes are integrated. */}
      <Route path="/payments/*" element={<DriverWalletPage />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<Placeholder title="Page" />} />
    </Routes>
  );
}
