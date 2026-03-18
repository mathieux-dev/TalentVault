export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  seniority: string;
  resumeUrl?: string | null;
  createdAt: string;
}

export interface CandidatesPageResponse {
  items: Candidate[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CandidateFilters {
  city?: string;
  seniority?: string;
  skills?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}

export interface CreateCandidateRequest {
  name: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
}

export interface PublicCandidateSubmissionRequest extends CreateCandidateRequest {
  file: File;
}
