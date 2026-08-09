export default function EmptyState({ icon = '\u{1F4E6}', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="text-5xl">{icon}</div>
      <h3 className="mt-2 text-lg font-bold text-slate-800">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-slate-500">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
