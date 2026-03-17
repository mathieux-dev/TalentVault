import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`w-full rounded border px-3 py-2 ${className}`.trim()} {...props} />;
  }
);

Input.displayName = 'Input';
