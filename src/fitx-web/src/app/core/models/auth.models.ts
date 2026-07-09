export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiration?: string;
  refreshExpiration?: string;
  error?: string;
  errors?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface QuickLoginAccount {
  email: string;
  nome: string;
  role: string;
  password: string;
  icon: string;
}

export interface QuickLoginResponse {
  success: boolean;
  accounts: QuickLoginAccount[];
}
