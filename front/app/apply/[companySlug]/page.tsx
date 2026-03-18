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
import { BrandLogo } from '@/components/branding/BrandLogo';
import { branding, hasFormBackground } from '@/config/branding';
import { formatPhone, isPhoneValid, normalizeEmail, onlyDigits } from '@/utils/form';

const maxFileSize = 5 * 1024 * 1024;

const schema = z.object({
  name: z.string().trim().min(2, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().trim().toLowerCase().email('Email inválido').max(255, 'Email muito longo'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine(isPhoneValid, 'Telefone inválido. Informe DDD + número.'),
  city: z.string().trim().min(2, 'Cidade é obrigatória').max(100, 'Cidade muito longa'),
  state: z.string().trim().max(50, 'Estado muito longo').optional(),
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
    if (isSubmitting) return;

    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await candidatesService.submitPublic(companySlug, {
        name: values.name.trim(),
        email: normalizeEmail(values.email),
        phone: onlyDigits(values.phone),
        city: values.city.trim(),
        state: values.state?.trim(),
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
    <main
      className="min-h-screen px-4 py-8 sm:py-10"
      style={
        hasFormBackground
          ? {
              backgroundImage: `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url(${branding.formBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {
              background:
                'radial-gradient(circle at top, color-mix(in srgb, var(--color-primary) 12%, #ffffff), #f8fafc 45%, #eef2ff 100%)',
            }
      }
    >
      <Card className="mx-auto max-w-2xl bg-white/95 p-5 sm:p-8">
        <div className="mb-8 space-y-3 text-center">
          <BrandLogo subtitle="Cadastro de candidatura" />
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Envie seu currículo</h1>
          <p className="text-sm leading-6 text-slate-600">
            Preencha seus dados e anexe um PDF para entrar no banco de talentos desta empresa.
          </p>
        </div>

        {submitError && <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
        {successMessage && <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nome completo</label>
            <Input {...register('name')} disabled={isSubmitting} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Telefone</label>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cidade</label>
              <Input {...register('city')} disabled={isSubmitting} />
              {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Estado</label>
              <Input {...register('state')} disabled={isSubmitting} />
              {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Curriculo em PDF</label>
            <Input type="file" accept=".pdf,application/pdf" {...register('resume')} disabled={isSubmitting} />
            {errors.resume && <p className="text-sm text-red-600">{String(errors.resume.message ?? 'Arquivo inválido')}</p>}
          </div>

          <Button className="w-full" type="submit" loading={isSubmitting} loadingText="Enviando...">
            Enviar curriculo
          </Button>
        </form>
      </Card>
    </main>
  );
}