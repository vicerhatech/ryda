export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-md items-center py-8">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-bold tracking-[0.2em] text-teal-700">RYDA</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
      </div>
    </section>
  );
}
