import { SelectHTMLAttributes, forwardRef } from 'react';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 ${className}`.trim()}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';
