import { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`rounded bg-white p-6 shadow ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
