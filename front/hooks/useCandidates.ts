'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { candidatesService } from '@/services/candidates';
import { CreateCandidateRequest } from '@/types/candidate';

export const useCandidates = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['candidates', page, pageSize],
    queryFn: () => candidatesService.list(page, pageSize),
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidatesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCandidateRequest) => candidatesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ candidateId, file }: { candidateId: string; file: File }) =>
      candidatesService.uploadResume(candidateId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
};
