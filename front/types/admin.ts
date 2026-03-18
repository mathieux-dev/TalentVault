import { ApiResponse } from '@/types/candidate';

export interface Company {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface CompanyUser {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR' | string;
  createdAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  slug?: string;
}

export interface CreateCompanyUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'HR';
}

export type CompanyApiResponse = ApiResponse<Company>;
export type CompanyListApiResponse = ApiResponse<Company[]>;
export type CompanyUserApiResponse = ApiResponse<CompanyUser>;
export type CompanyUserListApiResponse = ApiResponse<CompanyUser[]>;