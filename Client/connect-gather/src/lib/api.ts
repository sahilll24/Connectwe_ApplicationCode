import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; bio?: string; location?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
};

// Events API
export const eventsAPI = {
  getAll: (params?: { category?: string; search?: string; status?: string }) =>
    api.get('/events', { params }),
  getFeatured: () => api.get('/events/featured'),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  approve: (id: string) => api.put(`/events/${id}/approve`),
  reject: (id: string) => api.put(`/events/${id}/reject`),
  getPending: () => api.get('/events/pending/list'),
  register: (id: string) => api.post(`/events/${id}/register`),
  cancelRegistration: (id: string) => api.delete(`/events/${id}/register`),
  getMyEvents: () => api.get('/events/my/events'),
  getOrganizerEvents: () => api.get('/events/organizer/events'),
  getParticipants: (id: string) => api.get(`/events/${id}/participants`),
  getCategories: () => api.get('/events/categories/list'),
};

// User Dashboard API
export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
};

// Organizer Dashboard API
export const organizerAPI = {
  getDashboard: () => api.get('/user/organizer/dashboard'),
  getParticipants: () => api.get('/user/organizer/participants'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getOrganizers: () => api.get('/admin/organizers'),
  suspendUser: (id: string) => api.put(`/admin/users/${id}/suspend`),
  activateUser: (id: string) => api.put(`/admin/users/${id}/activate`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getReports: () => api.get('/admin/reports'),
};

export default api;
