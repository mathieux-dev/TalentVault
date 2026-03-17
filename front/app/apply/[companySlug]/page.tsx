'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { candidatesService } from '@/services/candidates';

const maxFileSize = 5 * 1024 * 1024;

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().min(1, 'Telefone é obrigatório').max(20, 'Telefone muito longo'),
  city: z.string().min(1, 'Cidade é obrigatória').max(100, 'Cidade muito longa'),
  state: z.string().max(50, 'Estado muito longo').optional(),
  seniority: z.string().min(1, 'Senioridade é obrigatória').max(50, 'Senioridade muito longa'),
  resume: z
    .any()
    .refine((files) => files && files.length > 0, 'Currículo é obrigatório')
    .refine((files) => files && files[0]?.name?.toLowerCase().endsWith('.pdf'), 'Apenas PDF')
    .refine((files) => files && files[0]?.size <= maxFileSize, 'Máximo 5MB'),
});

type FormValues = z.infer<typeof schema>;

type ErrorResponse = {
  errors?: string[];
};

export default function PublicApplicationPage() {
  const params = useParams<{ companySlug: string }>();
  const companySlug = params.companySlug;
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await candidatesService.submitPublic(companySlug, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city,
        state: values.state,
        seniority: values.seniority,
        file: values.resume[0],
      });

      reset();
      setSuccessMessage('Currículo enviado com sucesso. Nossa equipe poderá entrar em contato pelos dados informados.');
    } catch (error) {
      const response = (error as AxiosError<ErrorResponse>).response?.data;
      setSubmitError(response?.errors?.[0] ?? 'Não foi possível enviar o currículo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff7ed_45%,_#f8fafc_100%)] px-4 py-10">
      <Card className="mx-auto max-w-2xl border border-amber-200 bg-white/95 shadow-xl shadow-amber-100">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">TalentVault</p>
          <h1 className="text-3xl font-bold text-slate-900">Envie seu curriculo</h1>
          <p className="text-sm leading-6 text-slate-600">
            Preencha seus dados e anexe um PDF para entrar no banco de talentos desta empresa.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Empresa: {companySlug}</p>
        </div>

        {submitError && <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
        {successMessage && <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nome completo</label>
            <Input {...register('name')} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Telefone</label>
            <Input {...register('phone')} />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cidade</label>
              <Input {...register('city')} />
              {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Estado</label>
              <Input {...register('state')} />
              {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Senioridade</label>
            <Input placeholder="Junior, Pleno, Senior..." {...register('seniority')} />
            {errors.seniority && <p className="text-sm text-red-600">{errors.seniority.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Curriculo em PDF</label>
            <Input type="file" accept=".pdf,application/pdf" {...register('resume')} />
            {errors.resume && <p className="text-sm text-red-600">{String(errors.resume.message ?? 'Arquivo inválido')}</p>}
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar curriculo'}
          </Button>
        </form>
      </Card>
    </main>
  );
}