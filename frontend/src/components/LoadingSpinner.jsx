const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]'
};

export function LoadingSpinner({ size = 'md', light = false, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block animate-spin rounded-full border-t-transparent',
        sizeMap[size],
        light ? 'border-white' : 'border-brand-600',
        className
      ].join(' ')}
    />
  );
}

export default function LoadingScreen({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <LoadingSpinner size="lg" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
