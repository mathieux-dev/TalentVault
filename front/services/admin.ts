import api from '@/services/api';
import {
  Company,
  CompanyListApiResponse,
  CompanyUser,
  CompanyUserApiResponse,
  CompanyUserListApiResponse,
  CreateCompanyRequest,
  CreateCompanyUserRequest,
  CompanyApiResponse,
} from '@/types/admin';

export const adminService = {
  async listCompanies(): Promise<Company[]> {
    const response = await api.get<CompanyListApiResponse>('/admin/companies');
    return response.data.data;
  },

  async createCompany(payload: CreateCompanyRequest): Promise<Company> {
    const response = await api.post<CompanyApiResponse>('/admin/companies', payload);
    return response.data.data;
  },

  async listCompanyUsers(companyId: string): Promise<CompanyUser[]> {
    const response = await api.get<CompanyUserListApiResponse>(`/admin/companies/${companyId}/users`);
    return response.data.data;
  },

  async createCompanyUser(companyId: string, payload: CreateCompanyUserRequest): Promise<CompanyUser> {
    const response = await api.post<CompanyUserApiResponse>(`/admin/companies/${companyId}/users`, payload);
    return response.data.data;
  },
};