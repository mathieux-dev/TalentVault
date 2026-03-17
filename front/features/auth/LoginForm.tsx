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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="mb-6 text-2xl font-bold">TalentVault</h1>

          {submitError && <p className="mb-4 text-sm text-red-600">{submitError}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input {...register('email')} type="email" className="mt-1" disabled={isPending} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <Input {...register('password')} type="password" className="mt-1" disabled={isPending} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
