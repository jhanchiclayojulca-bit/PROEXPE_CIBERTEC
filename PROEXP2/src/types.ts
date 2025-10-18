export type Role = 'cliente' | 'admin';

export interface User {
  id?: string | number;
  name?: string;
  email?: string;
  role?: Role;
}

export interface AuthResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: User;
}