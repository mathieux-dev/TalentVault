export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  companyId: string;
  role: string;
  email?: string;
  name?: string;
}

export interface AuthContextType {
  userId: string | null;
  companyId: string | null;
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}
