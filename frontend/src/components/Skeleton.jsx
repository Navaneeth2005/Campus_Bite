// Skeleton placeholders shown while the menu is loading.
export function MenuCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 rounded bg-slate-200" />
          <div className="h-9 w-24 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}
