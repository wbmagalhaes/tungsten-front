import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@stores/useAuthStore';
import { refreshToken as refreshTokenRequest } from './auth.service';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.tungsten.rocks';

const api = axios.create({
  baseURL: new URL(baseURL).toString(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshingPromise: Promise<void> | null = null;
let redirectingToLogin = false;

function redirectToLogin() {
  if (redirectingToLogin) return;
  const path = window.location.pathname;
  if (path.startsWith('/login') || path.startsWith('/logout')) return;
  redirectingToLogin = true;
  useAuthStore.getState().clear();
  const redirectTo = `/login?cb_url=${encodeURIComponent(
    path + window.location.search,
  )}`;
  window.location.replace(redirectTo);
}

api.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toLowerCase();
  if (method !== 'get' && method !== 'head' && method !== 'options') {
    config.headers = config.headers || {};
    config.headers['X-CSRF-Protection'] = '1';
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
      error: err.message,
      status: err.status,
      retry: err.config?._retry,
    });

    const originalRequest = err.config;

    if (err.response?.status === 401 && originalRequest) {
      if (originalRequest.url?.endsWith('/auth/refresh')) {
        redirectToLogin();
        return Promise.reject(err);
      }

      if (originalRequest._retry) {
        redirectToLogin();
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      try {
        if (!refreshingPromise) {
          refreshingPromise = refreshTokenRequest().finally(() => {
            refreshingPromise = null;
          });
        }
        await refreshingPromise;
        return api(originalRequest);
      } catch (refreshErr) {
        redirectToLogin();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
