import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import './globals.css';
import Providers from './providers';
import { branding } from '@/config/branding';

export const metadata: Metadata = {
  title: 'TalentVault',
  description: 'TalentVault SaaS'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
