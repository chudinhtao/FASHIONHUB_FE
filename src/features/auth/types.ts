export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  user: Omit<User, 'refreshToken'>;
  accessToken: string;
}
