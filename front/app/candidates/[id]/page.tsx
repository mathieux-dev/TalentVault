'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCandidate } from '@/hooks/useCandidates';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { BrandLogo } from '@/components/branding/BrandLogo';

export default function CandidateDetailsPage() {
  const params = useParams<{ id: string }>();
  const candidateId = params?.id;
  const { isCheckingAuth } = useRequireAuth();

  const { data, isLoading, isError, error } = useCandidate(candidateId ?? '');

  if (isCheckingAuth) {
    return <main className="p-6">Validando acesso...</main>;
  }

  if (isLoading) {
    return <main className="p-6">Carregando candidato...</main>;
  }

  if (isError) {
    return <main className="p-6 text-red-600">Erro: {(error as Error).message}</main>;
  }

  if (!data) {
    return <main className="p-6">Candidato não encontrado.</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <Card className="mx-auto max-w-3xl">
        <div className="mb-4">
          <BrandLogo subtitle="Detalhes do candidato" />
        </div>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Detalhes do Candidato</h1>
          <Link href="/candidates" className="font-semibold text-[color:var(--color-primary)] hover:brightness-90">
            Voltar
          </Link>
        </div>

        <div className="space-y-3">
          <p><strong>Nome:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Telefone:</strong> {data.phone}</p>
          <p><strong>Cidade:</strong> {data.city}</p>
          <p><strong>Senioridade:</strong> {data.seniority}</p>
        </div>

        <div className="mt-6">
          {data.resumeUrl ? (
            <a
              href={data.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Button>Download resume</Button>
            </a>
          ) : (
            <p className="text-slate-600">Currículo ainda não enviado.</p>
          )}
        </div>
      </Card>
    </main>
  );
}
