import AppRoutes from './AppRoutes';
import Navigation from './navigation/Navigation';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <AppRoutes />
      </main>
    </div>
  );
}
