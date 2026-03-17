import { SelectHTMLAttributes, forwardRef } from 'react';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...props }, ref) => {
    return <select ref={ref} className={`w-full rounded border px-3 py-2 ${className}`.trim()} {...props} />;
  }
);

Select.displayName = 'Select';
