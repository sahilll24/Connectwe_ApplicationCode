import { authAPI } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  avatar?: string;
  bio?: string;
  location?: string;
  status: string;
  joinDate: string;
}

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getDashboardPath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'organizer':
      return '/organizer';
    default:
      return '/dashboard';
  }
};

export const login = async (email: string, password: string) => {
  const response = await authAPI.login({ email, password });
  const { token, user } = response.data;
  setToken(token);
  setUser(user);
  return { token, user };
};

export const register = async (name: string, email: string, password: string, role?: string) => {
  const response = await authAPI.register({ name, email, password, role });
  const { token, user } = response.data;
  setToken(token);
  setUser(user);
  return { token, user };
};

export const logout = (): void => {
  removeToken();
  removeUser();
};
