'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from './useLogin';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BrandLogoDefault } from '@/components/branding/BrandLogoDefault';
import { normalizeEmail } from '@/utils/form';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    if (isPending) return;

    setSubmitError('');
    login(
      {
        ...data,
        email: normalizeEmail(data.email),
      },
      {
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: () => {
        setSubmitError('Email ou senha inválidos');
      },
      }
    );
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
      }}
    >
      <Card className="w-full max-w-md bg-white/95 p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <BrandLogoDefault subtitle="Acesse sua conta" />
          </div>

          {submitError && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <Input
              type="email"
              className="mt-1"
              placeholder="nome@empresa.com"
              {...register('email', {
                setValueAs: (value) => normalizeEmail(String(value ?? '')),
              })}
              disabled={isPending}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <Input {...register('password')} type="password" className="mt-1" disabled={isPending} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" loading={isPending} loadingText="Entrando...">
            Entrar
          </Button>
        </form>
      </Card>
    </main>
  );
};
