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
import { AppHeader } from '@/components/layout/AppHeader';
import { formatPhone, isPhoneValid, normalizeEmail, onlyDigits } from '@/utils/form';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  name: z.string().trim().min(2, 'Nome é obrigatório'),
  email: z.string().trim().toLowerCase().email('Email inválido'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine(isPhoneValid, 'Telefone inválido. Informe DDD + número.'),
  city: z.string().trim().min(2, 'Cidade é obrigatória'),
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
  const isSubmitting = createCandidate.isPending || uploadResume.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    if (isSubmitting) return;

    setSubmitError('');
    try {
      const created = await createCandidate.mutateAsync({
        name: values.name.trim(),
        email: normalizeEmail(values.email),
        phone: onlyDigits(values.phone),
        city: values.city.trim(),
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
    <>
      <AppHeader showBackButton={true} backHref="/candidates" />
      <main className="p-4 sm:p-6">
        <Card className="mx-auto max-w-2xl p-5 sm:p-6">
          <h1 className="mb-6 text-2xl font-bold">Novo Candidato</h1>

          {submitError && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 block text-sm font-medium">Nome</label>
              <Input {...register('name')} disabled={isSubmitting} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="nome@empresa.com"
                {...register('email', {
                  setValueAs: (value) => normalizeEmail(String(value ?? '')),
                })}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Telefone</label>
              <Input
                placeholder="(11) 99999-9999"
                inputMode="numeric"
                maxLength={15}
                {...register('phone', {
                  onChange: (event) => {
                    event.target.value = formatPhone(event.target.value);
                  },
                })}
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Cidade</label>
              <Input {...register('city')} disabled={isSubmitting} />
              {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Currículo em PDF</label>
              <Input type="file" accept=".pdf,application/pdf" {...register('resume')} disabled={isSubmitting} />
              {errors.resume && (
                <p className="text-sm text-red-600">{String(errors.resume.message ?? 'Arquivo inválido')}</p>
              )}
            </div>

            <Button type="submit" loading={isSubmitting} loadingText="Salvando...">
              Cadastrar
            </Button>
          </form>
        </Card>
      </main>
    </>
  );
}

