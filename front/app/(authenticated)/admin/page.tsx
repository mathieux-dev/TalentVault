'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { adminService } from '@/services/admin';
import { Company, CompanyUser } from '@/types/admin';
import { AppHeader } from '@/components/layout/AppHeader';

type ErrorResponse = {
  errors?: string[];
};

function AdminPageSkeleton() {
  return (
    <>
      <AppHeader />
      <main className="p-4 sm:p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-8 w-72" />
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Card>
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </Card>
            <Card>
              <div className="space-y-3">
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

export default function AdminPage() {
  const { isCheckingAuth } = useRequireAuth();
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);

  const [companyName, setCompanyName] = useState('');
  const [companySlug, setCompanySlug] = useState('');
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<'Admin' | 'HR'>('HR');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) ?? null,
    [companies, selectedCompanyId]
  );

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }

    const storedRole = localStorage.getItem('role') ?? '';
    setRole(storedRole);

    if (storedRole !== 'Admin') {
      setIsLoading(false);
      return;
    }

    const fetchCompanies = async () => {
      try {
        const data = await adminService.listCompanies();
        setCompanies(data);

        if (data.length > 0) {
          setSelectedCompanyId(data[0].id);
        }
      } catch (error) {
        const response = (error as AxiosError<ErrorResponse>).response?.data;
        setErrorMessage(response?.errors?.[0] ?? 'Não foi possível carregar empresas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [isCheckingAuth]);

  useEffect(() => {
    if (!selectedCompanyId || role !== 'Admin') {
      setCompanyUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setIsUsersLoading(true);
      try {
        const users = await adminService.listCompanyUsers(selectedCompanyId);
        setCompanyUsers(users);
      } catch (error) {
        const response = (error as AxiosError<ErrorResponse>).response?.data;
        setErrorMessage(response?.errors?.[0] ?? 'Não foi possível carregar usuários da empresa.');
      } finally {
        setIsUsersLoading(false);
      }
    };

    fetchUsers();
  }, [selectedCompanyId, role]);

  const handleCreateCompany = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsCreatingCompany(true);

    try {
      const createdCompany = await adminService.createCompany({
        name: companyName,
        slug: companySlug || undefined,
      });

      const updatedCompanies = await adminService.listCompanies();
      setCompanies(updatedCompanies);
      setSelectedCompanyId(createdCompany.id);
      setCompanyName('');
      setCompanySlug('');
    } catch (error) {
      const response = (error as AxiosError<ErrorResponse>).response?.data;
      setErrorMessage(response?.errors?.[0] ?? 'Não foi possível criar empresa.');
    } finally {
      setIsCreatingCompany(false);
    }
  };

  const handleCreateUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedCompanyId) {
      setErrorMessage('Selecione uma empresa para cadastrar usuário.');
      return;
    }

    setErrorMessage('');
    setIsCreatingUser(true);

    try {
      await adminService.createCompanyUser(selectedCompanyId, {
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
      });

      const updatedUsers = await adminService.listCompanyUsers(selectedCompanyId);
      setCompanyUsers(updatedUsers);

      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setUserRole('HR');
    } catch (error) {
      const response = (error as AxiosError<ErrorResponse>).response?.data;
      setErrorMessage(response?.errors?.[0] ?? 'Não foi possível criar usuário.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (isCheckingAuth || isLoading) {
    return <AdminPageSkeleton />;
  }

  if (role !== 'Admin') {
    return (
      <>
        <AppHeader />
        <main className="p-4 sm:p-6">
          <Card className="mx-auto max-w-2xl">
            <h1 className="mb-2 text-2xl font-bold">Acesso restrito</h1>
            <p className="text-slate-600">Apenas usuários com perfil Admin podem acessar esta página.</p>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">Admin - Gestão Multiempresa</h1>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-lg font-semibold">Cadastrar empresa</h2>

              <form className="space-y-4" onSubmit={handleCreateCompany}>
                <div>
                  <label className="mb-1 block text-sm font-medium">Nome da empresa</label>
                  <Input
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    required
                    disabled={isCreatingCompany}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Slug (opcional)</label>
                  <Input
                    value={companySlug}
                    onChange={(event) => setCompanySlug(event.target.value)}
                    placeholder="ex: grupo-amorim"
                    disabled={isCreatingCompany}
                  />
                </div>

                <Button type="submit" loading={isCreatingCompany} loadingText="Salvando...">
                  Criar empresa
                </Button>
              </form>

              <div className="mt-6 border-t pt-4">
                <h3 className="mb-2 text-sm font-semibold uppercase text-slate-500">Empresas cadastradas</h3>
                <div className="space-y-2">
                  {companies.length === 0 ? (
                    <p className="text-sm text-slate-600">Nenhuma empresa cadastrada.</p>
                  ) : (
                    companies.map((company) => (
                      <div key={company.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <p className="font-medium">{company.name}</p>
                        <p className="text-slate-600">Slug: {company.slug}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="mb-2 text-lg font-semibold">Cadastrar usuário RH/Admin</h2>

              <form className="space-y-4" onSubmit={handleCreateUser}>
                <div>
                  <label className="mb-1 block text-sm font-medium">Empresa</label>
                  <Select
                    value={selectedCompanyId}
                    onChange={(event) => setSelectedCompanyId(event.target.value)}
                    required
                    disabled={isCreatingUser}
                  >
                    <option value="" disabled>
                      Selecione uma empresa
                    </option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Nome</label>
                  <Input
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                    required
                    disabled={isCreatingUser}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(event) => setUserEmail(event.target.value)}
                    required
                    disabled={isCreatingUser}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Senha</label>
                  <Input
                    type="password"
                    value={userPassword}
                    onChange={(event) => setUserPassword(event.target.value)}
                    required
                    minLength={6}
                    disabled={isCreatingUser}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Perfil</label>
                  <Select
                    value={userRole}
                    onChange={(event) => setUserRole(event.target.value as 'Admin' | 'HR')}
                    disabled={isCreatingUser}
                  >
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={!selectedCompanyId}
                  loading={isCreatingUser}
                  loadingText="Salvando..."
                >
                  Criar usuário
                </Button>
              </form>

              <div className="mt-6 border-t pt-4">
                <h3 className="mb-2 text-sm font-semibold uppercase text-slate-500">
                  Usuários {selectedCompany ? `de ${selectedCompany.name}` : ''}
                </h3>
                <div className="space-y-2">
                  {isUsersLoading ? (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  ) : companyUsers.length === 0 ? (
                    <p className="text-sm text-slate-600">Nenhum usuário para a empresa selecionada.</p>
                  ) : (
                    companyUsers.map((user) => (
                      <div key={user.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-slate-600">{user.email}</p>
                        <p className="text-slate-600">Perfil: {user.role}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {errorMessage && (
          <div className="mx-auto mt-6 max-w-5xl rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
      </main>
    </>
  );
}
