'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { BrandLogo } from '@/components/branding/BrandLogo';

export default function DashboardPage() {
  const { isCheckingAuth } = useRequireAuth();

  if (isCheckingAuth) {
    return <main className="p-6">Validando acesso...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <BrandLogo subtitle="Painel principal" />
        </div>

        <h1 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <Card>
            <h2 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">Banco de talentos</h2>
            <p className="mb-4 text-slate-600">Gerencie candidatos e currículos da sua empresa.</p>
            <Link href="/candidates" className="font-semibold text-[color:var(--color-primary)] hover:brightness-90">
              Ir para candidatos
            </Link>
          </Card>
          <Card>
            <h2 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">Acesso autenticado</h2>
            <p className="text-slate-600">Esta área fica disponível apenas para usuários logados.</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
