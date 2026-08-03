import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest.url.includes('/auth/login') ||
                        originalRequest.url.includes('/auth/refresh') ||
                        originalRequest.url.includes('/auth/me');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        if (data.data?.user) {
          useAuthStore.getState().setUser(data.data.user);
        }
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }

    if (error.response?.status === 401 && isAuthRoute && !originalRequest.url.includes('/auth/login')) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
