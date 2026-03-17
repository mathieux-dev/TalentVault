'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCandidate } from '@/hooks/useCandidates';

export default function CandidateDetailsPage() {
  const params = useParams<{ id: string }>();
  const candidateId = params?.id;

  const { data, isLoading, isError, error } = useCandidate(candidateId ?? '');

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
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detalhes do Candidato</h1>
          <Link href="/candidates" className="text-blue-600 hover:text-blue-800">
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
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Download resume
            </a>
          ) : (
            <p className="text-gray-600">Currículo ainda não enviado.</p>
          )}
        </div>
      </div>
    </main>
  );
}
