import { HTMLAttributes, ReactNode } from 'react';

type TableProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`.trim()} {...props}>
      <table className="min-w-full border-collapse border border-gray-200">{children}</table>
    </div>
  );
}
