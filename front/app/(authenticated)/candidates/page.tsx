'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useCandidates } from '@/hooks/useCandidates';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AppHeader } from '@/components/layout/AppHeader';

const DEFAULT_PAGE_SIZE = 10;

export default function CandidatesPage() {
  return (
    <Suspense fallback={<CandidatesPageSkeleton />}>
      <CandidatesPageContent />
    </Suspense>
  );
}

function CandidatesPageSkeleton() {
  return (
    <main className="p-4 sm:p-6">
      <Card className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="mb-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </Card>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    </main>
  );
}

function CandidatesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const pageParam = Number(searchParams.get('page') ?? '1');
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const city = searchParams.get('city') ?? '';
  const seniority = searchParams.get('seniority') ?? '';
  const skills = searchParams.get('skills') ?? '';

  const [cityInput, setCityInput] = useState(city);
  const [seniorityInput, setSeniorityInput] = useState(seniority);
  const [skillsInput, setSkillsInput] = useState(skills);

  const { isCheckingAuth } = useRequireAuth();
  const { data, isLoading, isError, error } = useCandidates(page, DEFAULT_PAGE_SIZE, {
    city: city || undefined,
    seniority: seniority || undefined,
    skills: skills || undefined,
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  const updateQueryParams = (next: { page?: number; city?: string; seniority?: string; skills?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.page && next.page > 1) {
      params.set('page', String(next.page));
    } else {
      params.delete('page');
    }

    if (next.city && next.city.trim().length > 0) {
      params.set('city', next.city.trim());
    } else {
      params.delete('city');
    }

    if (next.seniority && next.seniority.trim().length > 0) {
      params.set('seniority', next.seniority.trim());
    } else {
      params.delete('seniority');
    }

    if (next.skills && next.skills.trim().length > 0) {
      params.set('skills', next.skills.trim());
    } else {
      params.delete('skills');
    }

    const query = params.toString();
    router.replace(query.length > 0 ? `${pathname}?${query}` : pathname);
  };

  const applyFilters = () => {
    updateQueryParams({
      page: 1,
      city: cityInput,
      seniority: seniorityInput,
      skills: skillsInput,
    });
  };

  const clearFilters = () => {
    setCityInput('');
    setSeniorityInput('');
    setSkillsInput('');
    updateQueryParams({ page: 1, city: '', seniority: '', skills: '' });
  };

  if (isCheckingAuth) {
    return <main className="p-6">Validando acesso...</main>;
  }

  return (
    <>
      <AppHeader showBackButton={true} backHref="/dashboard" />
      <main className="p-4 sm:p-6">
        <Card className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold">Candidatos</h1>
            <Link href="/candidates/new">
              <Button className="w-full sm:w-auto">Novo candidato</Button>
            </Link>
          </div>

          <Card className="mb-6">
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Cidade</label>
                <Input
                  value={cityInput}
                  onChange={(event) => setCityInput(event.target.value)}
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Senioridade</label>
                <Select
                  value={seniorityInput}
                  onChange={(event) => setSeniorityInput(event.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="Junior">Junior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Senior">Senior</option>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Skills (vírgula)</label>
                <Input
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                  placeholder="Ex: c#, sql"
                />
              </div>

              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end">
                <Button type="button" onClick={applyFilters} className="w-full sm:w-auto">
                  Filtrar
                </Button>
                <Button type="button" variant="secondary" onClick={clearFilters} className="w-full sm:w-auto">
                  Limpar
                </Button>
              </div>
            </div>
          </Card>

          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {isError && <p className="text-red-600">Erro ao carregar candidatos: {(error as Error).message}</p>}

          {!isLoading && !isError && data && (
            <>
              <Table>
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Nome</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Cidade</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-center text-gray-500" colSpan={4}>
                        Nenhum candidato encontrado.
                      </td>
                    </tr>
                  ) : (
                    data.items.map((candidate) => (
                      <tr key={candidate.id}>
                        <td className="border border-gray-200 px-4 py-2">{candidate.name}</td>
                        <td className="border border-gray-200 px-4 py-2">{candidate.email}</td>
                        <td className="border border-gray-200 px-4 py-2">{candidate.city}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Link
                            href={`/candidates/${candidate.id}`}
                            className="font-semibold text-[color:var(--color-primary)] hover:brightness-90"
                          >
                            Ver detalhes
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Página {data.page} de {totalPages} • Total: {data.total}
                </p>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => updateQueryParams({ page: Math.max(1, page - 1), city, seniority, skills })}
                    disabled={page <= 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => updateQueryParams({ page: Math.min(totalPages, page + 1), city, seniority, skills })}
                    disabled={page >= totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </main>
    </>
  );
}
