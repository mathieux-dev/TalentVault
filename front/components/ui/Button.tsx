import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  loadingText?: string;
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  loading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  const baseClassName =
    'rounded-lg px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]';
  const variantClassName =
    variant === 'secondary'
      ? 'border border-[color:var(--color-border)] bg-white text-slate-700 hover:bg-slate-50'
      : 'bg-[color:var(--color-primary)] text-white hover:brightness-95';
  const isDisabled = disabled || loading;
  const text = loadingText ?? children;

  return (
    <button
      className={`${baseClassName} ${variantClassName} ${className}`.trim()}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>{text}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
