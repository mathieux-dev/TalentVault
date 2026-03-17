import api from '@/services/api';
import {
  ApiResponse,
  Candidate,
  CandidatesPageResponse,
  CreateCandidateRequest,
  PublicCandidateSubmissionRequest,
} from '@/types/candidate';

export const candidatesService = {
  async list(page: number, pageSize: number): Promise<CandidatesPageResponse> {
    const response = await api.get<ApiResponse<CandidatesPageResponse>>('/candidates', {
      params: { page, pageSize },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Candidate> {
    const response = await api.get<ApiResponse<Candidate>>(`/candidates/${id}`);
    return response.data.data;
  },

  async create(payload: CreateCandidateRequest): Promise<Candidate> {
    const response = await api.post<ApiResponse<Candidate>>('/candidates', payload);
    return response.data.data;
  },

  async uploadResume(candidateId: string, file: File): Promise<{ resumeUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<{ resumeUrl: string }>>(
      `/candidates/${candidateId}/resume`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },

  async submitPublic(companySlug: string, payload: PublicCandidateSubmissionRequest): Promise<Candidate> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone);
    formData.append('city', payload.city);
    formData.append('state', payload.state ?? '');
    formData.append('seniority', payload.seniority);
    formData.append('file', payload.file);

    const response = await api.post<ApiResponse<Candidate>>(
      `/public/applications/${companySlug}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },
};
