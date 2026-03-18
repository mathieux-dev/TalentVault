'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCandidate } from '@/hooks/useCandidates';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AppHeader } from '@/components/layout/AppHeader';

export default function CandidateDetailsPage() {
  const params = useParams<{ id: string }>();
  const candidateId = params?.id;
  const { isCheckingAuth } = useRequireAuth();

  const { data, isLoading, isError, error } = useCandidate(candidateId ?? '');

  if (isCheckingAuth) {
    return <main className="p-6">Validando acesso...</main>;
  }

  if (isLoading) {
    return (
      <>
        <AppHeader showBackButton={true} backHref="/candidates" />
        <main className="p-4 sm:p-6">
          <Card className="mx-auto max-w-3xl">
            <Skeleton className="mb-6 h-8 w-64" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            <Skeleton className="mt-6 h-10 w-40" />
          </Card>
        </main>
      </>
    );
  }

  if (isError) {
    return <main className="p-6 text-red-600">Erro: {(error as Error).message}</main>;
  }

  if (!data) {
    return <main className="p-6">Candidato não encontrado.</main>;
  }

  return (
    <>
      <AppHeader showBackButton={true} backHref="/candidates" />
      <main className="p-4 sm:p-6">
        <Card className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">Detalhes do Candidato</h1>

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
                <Button>Baixar currículo</Button>
              </a>
            ) : (
              <p className="text-slate-600">Currículo ainda não enviado.</p>
            )}
          </div>
        </Card>
      </main>
    </>
  );
}
