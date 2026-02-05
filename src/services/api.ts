import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@stores/useAuthStore';
import { refreshToken as refreshTokenRequest } from './auth.service';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/';

const api = axios.create({
  baseURL: new URL('api', baseURL).toString(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicRoutes = ['/ping', '/auth/token', '/auth/refresh'];

api.interceptors.request.use((config) => {
  if (!config.url) return config;

  const isPublic = publicRoutes.some((route) => config.url?.endsWith(route));
  if (!isPublic) {
    const accessToken = Cookies.get('access');
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (
    err: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } },
  ) => {
    console.error('[API ERROR]', {
      url: err.config?.url,
      method: err.config?.method,
      data: err.config?.data,
      error: err.message,
    });

    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh');
        if (!refreshToken) {
          return Promise.reject(err);
        }

        const tokens = await refreshTokenRequest({ token: refreshToken });
        useAuthStore.getState().setTokens(tokens.access, tokens.refresh);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${tokens.access}`;
        }

        return api(originalRequest);
      } catch (refreshErr) {
        useAuthStore.getState().clearTokens();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
