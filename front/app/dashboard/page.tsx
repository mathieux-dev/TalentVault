'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function DashboardPage() {
  const { isCheckingAuth } = useRequireAuth();

  if (isCheckingAuth) {
    return <main className="p-6">Validando acesso...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="mb-2 text-xl font-semibold">Banco de talentos</h2>
            <p className="mb-4 text-gray-600">Gerencie candidatos e currículos da sua empresa.</p>
            <Link href="/candidates" className="font-medium text-blue-600 hover:text-blue-800">
              Ir para candidatos
            </Link>
          </Card>
          <Card>
            <h2 className="mb-2 text-xl font-semibold">Acesso autenticado</h2>
            <p className="text-gray-600">Esta área fica disponível apenas para usuários logados.</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
