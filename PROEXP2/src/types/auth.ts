export interface User {
  id_usuario: number;
  email: string;
  nombre: string;
  apellido: string;
  cod_cliente: string;
  rol: 'admin' | 'cliente';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  rol: 'admin' | 'cliente';
}
