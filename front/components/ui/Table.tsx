import { HTMLAttributes, ReactNode } from 'react';

type TableProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-200 ${className}`.trim()} {...props}>
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  );
}
