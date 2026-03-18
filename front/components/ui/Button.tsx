import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const baseClassName =
    'rounded-lg px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]';
  const variantClassName =
    variant === 'secondary'
      ? 'border border-[color:var(--color-border)] bg-white text-slate-700 hover:bg-slate-50'
      : 'bg-[color:var(--color-primary)] text-white hover:brightness-95';

  return (
    <button className={`${baseClassName} ${variantClassName} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
