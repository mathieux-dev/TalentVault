'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCandidates } from '@/hooks/useCandidates';

const DEFAULT_PAGE_SIZE = 10;

export default function CandidatesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useCandidates(page, DEFAULT_PAGE_SIZE);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl rounded bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Candidatos</h1>
          <Link
            href="/candidates/new"
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Novo candidato
          </Link>
        </div>

        {isLoading && <p>Carregando candidatos...</p>}

        {isError && (
          <p className="text-red-600">
            Erro ao carregar candidatos: {(error as Error).message}
          </p>
        )}

        {!isLoading && !isError && data && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Nome</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Cidade</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Senioridade</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                        Nenhum candidato encontrado.
                      </td>
                    </tr>
                  ) : (
                    data.items.map((candidate) => (
                      <tr key={candidate.id}>
                        <td className="border border-gray-200 px-4 py-2">{candidate.name}</td>
                        <td className="border border-gray-200 px-4 py-2">{candidate.email}</td>
                        <td className="border border-gray-200 px-4 py-2">{candidate.city}</td>
                        <td className="border border-gray-200 px-4 py-2">{candidate.seniority}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Link
                            href={`/candidates/${candidate.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            Ver detalhes
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Página {data.page} de {totalPages} • Total: {data.total}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border px-3 py-2 disabled:opacity-50"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="rounded border px-3 py-2 disabled:opacity-50"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
