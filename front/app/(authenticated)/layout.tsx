import type { CSSProperties } from 'react';
import { branding } from '@/config/branding';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={
        {
          '--color-primary': branding.primaryColor,
          '--color-secondary': branding.secondaryColor,
        } as CSSProperties
      }
    >
      <div
        style={
          branding.initialBackgroundImage
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${branding.initialBackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
              }
            : { minHeight: '100vh', backgroundColor: '#f1f5f9' }
        }
        className="relative"
      >
        {children}
      </div>
    </div>
  );
}
