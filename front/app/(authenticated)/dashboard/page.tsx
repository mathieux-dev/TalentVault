'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AppHeader } from '@/components/layout/AppHeader';
import { branding } from '@/config/branding';

export default function DashboardPage() {
  const { isCheckingAuth } = useRequireAuth();

  if (isCheckingAuth) {
    return <main className="p-6">Validando acesso...</main>;
  }

  return (
    <>
      <AppHeader />
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 border-l-4 border-[color:var(--color-primary)] pl-4">
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Bem-vindo ao Dashboard</h1>
            <p className="text-slate-200">Gerencie candidatos e recursos da sua empresa.</p>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Banco de talentos</h2>
              <p className="mb-4 text-slate-600">Acesse e gerencie todos os candidatos cadastrados.</p>
              <Link href="/candidates">
                <Button className="w-full">Ver candidatos</Button>
              </Link>
            </Card>

            <Card>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Novo candidato</h2>
              <p className="mb-4 text-slate-600">Cadastre um novo candidato no banco de talentos.</p>
              <Link href="/candidates/new">
                <Button className="w-full">Cadastrar</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
