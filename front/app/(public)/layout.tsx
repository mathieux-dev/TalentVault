import type { CSSProperties } from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={
        {
          '--color-primary': '#2563eb',
          '--color-secondary': '#0f172a',
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
