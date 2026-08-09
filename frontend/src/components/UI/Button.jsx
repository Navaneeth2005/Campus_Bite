import { LoadingSpinner } from '../LoadingSpinner';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  outline: 'bg-transparent text-brand-600 border border-brand-600 hover:bg-brand-50 focus-visible:ring-brand-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-600'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      ].join(' ')}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" light />}
      {children}
    </button>
  );
}
