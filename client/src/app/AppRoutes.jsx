import { Route, Routes } from 'react-router-dom';

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
      {/* Feature owners replace these baseline placeholders when their routes are integrated. */}
      <Route path="/payments/*" element={<Placeholder title="Payments" />} />
      <Route path="/admin/*" element={<Placeholder title="Admin" />} />
      <Route path="*" element={<Placeholder title="Page" />} />
    </Routes>
  );
}
