'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCreateCandidate, useUploadResume } from '@/hooks/useCandidates';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  seniority: z.string().min(1, 'Senioridade é obrigatória'),
  resume: z
    .any()
    .refine((files) => files && files.length > 0, 'Currículo é obrigatório')
    .refine((files) => files && files[0]?.name?.toLowerCase().endsWith('.pdf'), 'Apenas PDF')
    .refine((files) => files && files[0]?.size <= MAX_FILE_SIZE, 'Máximo 5MB'),
});

type FormValues = z.infer<typeof schema>;

export default function NewCandidatePage() {
  const router = useRouter();
  const { isCheckingAuth } = useRequireAuth();
  const [submitError, setSubmitError] = useState('');
  const createCandidate = useCreateCandidate();
  const uploadResume = useUploadResume();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError('');
    try {
      const created = await createCandidate.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        seniority: values.seniority,
      });

      await uploadResume.mutateAsync({
        candidateId: created.id,
        file: values.resume[0],
      });

      router.push('/candidates');
    } catch {
      setSubmitError('Não foi possível cadastrar o candidato.');
    }
  };

  if (isCheckingAuth) {
    return <main className="p-6">Validando acesso...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Card className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">Novo Candidato</h1>

        {submitError && <p className="mb-4 text-sm text-red-600">{submitError}</p>}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium">Nome</label>
            <Input {...register('name')} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Telefone</label>
            <Input {...register('phone')} />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Cidade</label>
            <Input {...register('city')} />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Senioridade</label>
            <Input {...register('seniority')} />
            {errors.seniority && <p className="text-sm text-red-600">{errors.seniority.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Resume Upload (PDF)</label>
            <Input type="file" accept=".pdf,application/pdf" {...register('resume')} />
            {errors.resume && (
              <p className="text-sm text-red-600">{String(errors.resume.message ?? 'Arquivo inválido')}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={createCandidate.isPending || uploadResume.isPending}
          >
            {createCandidate.isPending || uploadResume.isPending ? 'Salvando...' : 'Cadastrar'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
