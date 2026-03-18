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
import { BrandLogo } from '@/components/branding/BrandLogo';
import { branding, hasInitialBackground } from '@/config/branding';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
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
    setSubmitError('');
    login(data, {
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: () => {
        setSubmitError('Email ou senha inválidos');
      },
    });
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={
        hasInitialBackground
          ? {
              backgroundImage: `linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.6)), url(${branding.initialBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {
              background:
                'radial-gradient(circle at top, color-mix(in srgb, var(--color-primary) 16%, #ffffff), #f8fafc 45%, #f1f5f9 100%)',
            }
      }
    >
      <Card className="w-full max-w-md bg-white/95 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <BrandLogo subtitle="Acesse sua conta" />
          </div>

          {submitError && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <Input {...register('email')} type="email" className="mt-1" disabled={isPending} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <Input {...register('password')} type="password" className="mt-1" disabled={isPending} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </main>
  );
};
