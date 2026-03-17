import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const baseClassName = 'rounded px-4 py-2 font-medium transition disabled:opacity-50';
  const variantClassName =
    variant === 'secondary'
      ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
      : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button className={`${baseClassName} ${variantClassName} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
